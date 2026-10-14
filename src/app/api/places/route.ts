import { NextRequest, NextResponse } from "next/server";
import { PlacesApiResponse, PublicBusinessPlace, GooglePlaceReview, TELANGANA_CITIES } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category") || "contractors";
  const cityParam = searchParams.get("city") || "Hyderabad";
  const customQuery = searchParams.get("query") || "";

  const category = categoryParam === "suppliers" ? "suppliers" : "contractors";
  const validCities = TELANGANA_CITIES as readonly string[];

  // Default to Hyderabad if city is not recognized
  const city = validCities.includes(cityParam) ? cityParam : "Hyderabad";

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  // 1. If API key is not configured, return honest API_KEY_REQUIRED response (Do not invent data!)
  if (!apiKey || apiKey.trim() === "") {
    const responseData: PlacesApiResponse = {
      status: "API_KEY_REQUIRED",
      isConfigured: false,
      message:
        "Google Maps Platform Places API key is not configured on the server. Set GOOGLE_PLACES_API_KEY in your .env.local file to query live public business listings in Telangana.",
      category,
      city,
      results: [],
      attribution: "Powered by Google Maps Platform (Configuration Pending)",
    };

    return NextResponse.json(responseData, { status: 200 });
  }

  // 2. Build search query targeted within Telangana
  const baseQuery =
    category === "contractors"
      ? customQuery || `flooring contractors marble tile workers in ${city}, Telangana`
      : customQuery || `marble granite tile suppliers stone depots in ${city}, Telangana`;

  try {
    // Try Google Places API (New) Text Search
    const placesNewEndpoint = "https://places.googleapis.com/v1/places:searchText";
    const fieldMask = [
      "places.id",
      "places.displayName",
      "places.formattedAddress",
      "places.googleMapsUri",
      "places.nationalPhoneNumber",
      "places.rating",
      "places.userRatingCount",
      "places.websiteUri",
      "places.businessStatus",
      "places.primaryType",
      "places.reviews",
    ].join(",");

    const placesNewResponse = await fetch(placesNewEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify({
        textQuery: baseQuery,
        languageCode: "en",
        maxResultCount: 8,
      }),
      cache: "no-store",
    });

    if (placesNewResponse.ok) {
      const data = await placesNewResponse.json();
      const rawPlaces = data.places || [];

      if (rawPlaces.length === 0) {
        return NextResponse.json({
          status: "ZERO_RESULTS",
          isConfigured: true,
          message: `No publicly listed ${category === "contractors" ? "flooring contractors" : "material suppliers"} were returned for ${city}, Telangana via Google Places API.`,
          category,
          city,
          results: [],
          attribution: "Powered by Google",
        });
      }

      const results: PublicBusinessPlace[] = rawPlaces.map((p: any) => {
        const reviews: GooglePlaceReview[] = (p.reviews || []).slice(0, 3).map((r: any) => ({
          authorName: r.authorAttribution?.displayName || "Google Reviewer",
          authorPhotoUrl: r.authorAttribution?.photoUri,
          authorUrl: r.authorAttribution?.uri,
          rating: r.rating || 5,
          relativeTimeDescription: r.relativePublishTimeDescription || "Recent",
          text: r.text?.text || r.originalText?.text || "",
          publishTime: r.publishTime,
        }));

        return {
          id: p.id,
          name: p.displayName?.text || "Publicly Listed Enterprise",
          category: category === "contractors" ? "contractor" : "supplier",
          formattedAddress: p.formattedAddress || `${city}, Telangana`,
          locationCity: city,
          state: "Telangana" as const,
          googleMapsUri: p.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName?.text + " " + city)}`,
          nationalPhoneNumber: p.nationalPhoneNumber || undefined,
          websiteUri: p.websiteUri || undefined,
          rating: typeof p.rating === "number" ? p.rating : undefined,
          userRatingCount: typeof p.userRatingCount === "number" ? p.userRatingCount : undefined,
          businessStatus: p.businessStatus,
          verificationStatus: "Publicly Listed" as const,
          source: "Google Maps Platform Places API" as const,
          reviews: reviews.length > 0 ? reviews : undefined,
          primaryType: p.primaryType,
        };
      });

      return NextResponse.json({
        status: "OK",
        isConfigured: true,
        message: `Retrieved ${results.length} publicly listed business records for ${city}, Telangana.`,
        category,
        city,
        results,
        attribution: "Powered by Google",
      });
    }

    // Fallback: If Places (New) is not enabled on the API key, try Legacy Text Search
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      baseQuery
    )}&key=${apiKey}`;

    const legacyResponse = await fetch(legacyUrl, { cache: "no-store" });
    if (legacyResponse.ok) {
      const legacyData = await legacyResponse.json();

      if (legacyData.status === "ZERO_RESULTS" || !legacyData.results || legacyData.results.length === 0) {
        return NextResponse.json({
          status: "ZERO_RESULTS",
          isConfigured: true,
          message: `No publicly listed ${category === "contractors" ? "flooring contractors" : "material suppliers"} were returned for ${city}, Telangana.`,
          category,
          city,
          results: [],
          attribution: "Powered by Google",
        });
      }

      if (legacyData.status === "REQUEST_DENIED" || legacyData.status === "OVER_QUERY_LIMIT") {
        return NextResponse.json({
          status: "ERROR",
          isConfigured: true,
          message: `Google Places API returned status: ${legacyData.status}. Please check billing and enabled APIs on Google Cloud Console.`,
          category,
          city,
          results: [],
          attribution: "Powered by Google",
        });
      }

      const results: PublicBusinessPlace[] = legacyData.results.slice(0, 8).map((p: any) => ({
        id: p.place_id,
        name: p.name,
        category: category === "contractors" ? "contractor" : "supplier",
        formattedAddress: p.formatted_address || `${city}, Telangana`,
        locationCity: city,
        state: "Telangana" as const,
        googleMapsUri: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
        nationalPhoneNumber: undefined, // Legacy text search requires Place Details for phone
        websiteUri: undefined,
        rating: typeof p.rating === "number" ? p.rating : undefined,
        userRatingCount: typeof p.user_ratings_total === "number" ? p.user_ratings_total : undefined,
        businessStatus: p.business_status,
        verificationStatus: "Publicly Listed" as const,
        source: "Google Maps Platform Places API" as const,
      }));

      return NextResponse.json({
        status: "OK",
        isConfigured: true,
        message: `Retrieved ${results.length} publicly listed business records for ${city}, Telangana via Google Maps Platform.`,
        category,
        city,
        results,
        attribution: "Powered by Google",
      });
    }

    return NextResponse.json({
      status: "ERROR",
      isConfigured: true,
      message: `Failed to query Google Maps Platform Places API (HTTP ${placesNewResponse.status}).`,
      category,
      city,
      results: [],
      attribution: "Powered by Google",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "ERROR",
      isConfigured: true,
      message: error?.message || "An unexpected error occurred while querying Google Maps Places API.",
      category,
      city,
      results: [],
      attribution: "Powered by Google",
    });
  }
}
