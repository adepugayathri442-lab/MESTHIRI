-- =========================================================================
-- MESTHIRI Database Migration: Authentication, Profiles, and Labour Verification
-- File: supabase/migrations/20261013_auth_and_verification.sql
-- Description: Sets up role-based profiles, private labour-documents storage,
--              Row Level Security (RLS), and reviewer audit workflows.
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Roles Enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('homeowner', 'worker', 'shop', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Verification Status Enum
DO $$ BEGIN
  CREATE TYPE worker_verification_status AS ENUM (
    'Draft',
    'Document Uploaded',
    'Pending Verification',
    'Verified',
    'Rejected — Re-upload Required'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. Public Profiles Table (Contains public display info only)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'homeowner',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL DEFAULT 'Hyderabad',
  service_area_neighborhood TEXT,
  bio TEXT,
  avatar_url TEXT,
  
  -- Worker-specific public display fields
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  typical_sqft_rate NUMERIC(10, 2),
  is_available_for_work BOOLEAN DEFAULT false,
  verification_status worker_verification_status DEFAULT 'Draft',
  
  -- Shop-specific fields
  shop_name TEXT,
  shop_address TEXT,
  categories_stocked TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast directory lookups of verified workers
CREATE INDEX IF NOT EXISTS idx_profiles_verified_workers 
  ON public.profiles(role, verification_status, city) 
  WHERE role = 'worker' AND verification_status = 'Verified';

-- 4. Private Worker Verifications Table (SENSITIVE - Restricted Access)
-- Holds labour registration cards, document numbers, storage paths, and audit trails.
CREATE TABLE IF NOT EXISTS public.worker_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_category TEXT NOT NULL, -- e.g. "Telangana BOCWWB Construction Worker Card"
  issuing_state TEXT NOT NULL DEFAULT 'Telangana',
  document_number_encrypted TEXT,   -- Sensitive document registration number
  document_number_masked TEXT,      -- e.g. "***4912" for review list display
  file_storage_path TEXT NOT NULL,  -- Private storage object path in labour-documents bucket
  file_name TEXT NOT NULL,
  file_size_kb INTEGER NOT NULL,
  file_type TEXT NOT NULL,          -- application/pdf, image/jpeg, image/png
  status worker_verification_status NOT NULL DEFAULT 'Pending Verification',
  
  -- Review Audit Trail
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  rejection_reason TEXT,
  
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_worker_verifications_status 
  ON public.worker_verifications(status);

-- 5. Private Supabase Storage Bucket Configuration
-- Ensure the 'labour-documents' bucket exists and is set to private (public: false)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'labour-documents',
  'labour-documents',
  false,
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

-- 6. Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_verifications ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if the calling user is an authorized admin/reviewer
CREATE OR REPLACE FUNCTION public.is_authorized_reviewer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
-- A. Public Directory: ANY user (even unauthenticated) can view ONLY Verified workers
CREATE POLICY "Public can only view verified workers or shops"
  ON public.profiles
  FOR SELECT
  USING (
    (role = 'worker' AND verification_status = 'Verified')
    OR (role = 'shop')
    OR (auth.uid() = id)
    OR public.is_authorized_reviewer()
  );

-- B. Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    -- Workers cannot self-promote to 'Verified'
    auth.uid() = id AND (
      (role = 'worker' AND verification_status = OLD.verification_status)
      OR public.is_authorized_reviewer()
    )
  );

-- C. Users can insert their own profile during signup
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Worker Verifications Policies (STRICT PRIVATE ACCESS)
-- A. Worker can insert their own verification submission
CREATE POLICY "Worker can upload own verification record"
  ON public.worker_verifications
  FOR INSERT
  WITH CHECK (auth.uid() = worker_id);

-- B. Worker can view their own verification record status (but not other workers')
CREATE POLICY "Worker can view own verification record"
  ON public.worker_verifications
  FOR SELECT
  USING (auth.uid() = worker_id OR public.is_authorized_reviewer());

-- C. Only authorized reviewers can update verification status (Approve / Reject)
CREATE POLICY "Only authorized reviewers can review verifications"
  ON public.worker_verifications
  FOR UPDATE
  USING (public.is_authorized_reviewer())
  WITH CHECK (public.is_authorized_reviewer());

-- Storage Bucket RLS Policies for 'labour-documents'
-- Worker can upload files ONLY into their own folder ({worker_id}/*)
CREATE POLICY "Workers can upload documents to own folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'labour-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Worker can read their own documents; Reviewers can read all documents
CREATE POLICY "Worker and Reviewers can read labour documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'labour-documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_authorized_reviewer()
    )
  );

-- Function to synchronize profile status when reviewer approves or rejects
CREATE OR REPLACE FUNCTION public.handle_verification_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status <> OLD.status THEN
    UPDATE public.profiles
    SET 
      verification_status = NEW.status,
      is_available_for_work = (NEW.status = 'Verified'),
      updated_at = NOW()
    WHERE id = NEW.worker_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_verification_status_change ON public.worker_verifications;
CREATE TRIGGER on_verification_status_change
  AFTER UPDATE OF status ON public.worker_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_verification_status_change();
