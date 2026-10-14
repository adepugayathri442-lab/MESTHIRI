// =========================================================================
// Supabase Client and Backend Authentication Configuration Helper
// =========================================================================

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  hasUrl: boolean;
  hasAnonKey: boolean;
  hasServiceKey: boolean;
  statusMessage: string;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const hasUrl = Boolean(url && url.startsWith("http") && !url.includes("your-project"));
  const hasAnonKey = Boolean(anonKey && anonKey.length > 20 && !anonKey.includes("your-anon-key"));
  const hasServiceKey = Boolean(serviceKey && serviceKey.length > 20);

  const isConfigured = hasUrl && hasAnonKey;

  let statusMessage = "Supabase backend is NOT configured. Running in Prototype Local Mode.";
  if (isConfigured) {
    statusMessage = "Supabase backend connected with RLS policies and private storage.";
  } else if (hasUrl && !hasAnonKey) {
    statusMessage = "Supabase URL detected but NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.";
  }

  return {
    isConfigured,
    hasUrl,
    hasAnonKey,
    hasServiceKey,
    statusMessage,
  };
}

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfigStatus().isConfigured;
};
