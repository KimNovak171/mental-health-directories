import type { Facility } from "@/components/FacilityCard";
import alaskaData from "@/data/alaska_facilities.json";
import arizonaData from "@/data/arizona_facilities.json";
import arkansasData from "@/data/arkansas_facilities.json";
import connecticutData from "@/data/connecticut_facilities.json";
import delawareData from "@/data/delaware_facilities.json";
import floridaData from "@/data/florida_facilities.json";

type AlternateFormatFacilityRaw = {
  name: string;
  category?: string;
  care_type?: string;
  type?: string;
  address: string;
  street?: string;
  city: string;
  state: string;
  state_code?: string;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  reviews?: number | null;
  reviews_link?: string | null;
  place_id?: string | null;
  recommended?: boolean;
  featured?: boolean;
  premium?: boolean;
  logo?: string | null;
  tagline?: string | null;
};

type StateFileShape = {
  state: string;
  state_code?: string;
  state_slug: string;
  facilities: AlternateFormatFacilityRaw[];
};

function slugify(text: string | null | undefined): string {
  return (text ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function transformAlternateFormatFacilities(
  facilities: AlternateFormatFacilityRaw[],
  stateName: string,
  stateSlug: string,
): RawFacility[] {
  const valid = facilities.filter(
    (f) => ((f.city ?? "").trim() !== ""),
  );
  return valid.map((f, index) => {
    const citySlug = slugify(f.city);
    const nameSlug = slugify(f.name);
    const id = `${nameSlug}-${citySlug}-${index}`;
    const addressParts = ((f.address ?? "").trim() || "").split(",").map((s) => s.trim());
    const addressLine1 = addressParts[0] ?? "";
    const addressLine2 = addressParts.length > 1 ? addressParts.slice(1).join(", ") : undefined;
    const mapsUrl =
      (f.reviews_link && String(f.reviews_link).trim())
        ? String(f.reviews_link).trim()
        : f.place_id
          ? `https://search.google.com/local/reviews?placeid=${f.place_id}&q=*&authuser=0&hl=en&gl=US`
          : undefined;
    const categorySource = (f.category ?? f.care_type ?? f.type ?? "").trim();
    const careTypes = categorySource
      ? [categorySource]
      : ["Mental health service"];
    return {
      id,
      name: (f.name ?? "").trim() || "Unnamed",
      state: stateName,
      stateSlug,
      city: (f.city ?? "").trim() || "",
      citySlug,
      addressLine1,
      addressLine2: addressLine2 || null,
      phone: f.phone ?? null,
      websiteUrl: f.website ?? null,
      mapsUrl: mapsUrl ?? null,
      rating: f.rating ?? null,
      reviewCount: f.reviews ?? null,
      careTypes,
      featured: f.featured ?? undefined,
      premium: f.premium ?? undefined,
      recommended: f.recommended ?? undefined,
      logo: f.logo ?? undefined,
      tagline: f.tagline ?? undefined,
    };
  });
}

const alaskaDataTyped = alaskaData as StateFileShape;
const arizonaDataTyped = arizonaData as StateFileShape;
const arkansasDataTyped = arkansasData as StateFileShape;
const connecticutDataTyped = connecticutData as StateFileShape;
const delawareDataTyped = delawareData as StateFileShape;
const floridaDataTyped = floridaData as StateFileShape;

const alaskaFacilities = transformAlternateFormatFacilities(
  alaskaDataTyped.facilities,
  alaskaDataTyped.state,
  alaskaDataTyped.state_slug,
);

const arizonaFacilities = transformAlternateFormatFacilities(
  arizonaDataTyped.facilities,
  arizonaDataTyped.state,
  arizonaDataTyped.state_slug,
);

const arkansasFacilities = transformAlternateFormatFacilities(
  arkansasDataTyped.facilities,
  arkansasDataTyped.state,
  arkansasDataTyped.state_slug,
);

const connecticutFacilities = transformAlternateFormatFacilities(
  connecticutDataTyped.facilities,
  connecticutDataTyped.state,
  connecticutDataTyped.state_slug,
);

const delawareFacilities = transformAlternateFormatFacilities(
  delawareDataTyped.facilities,
  delawareDataTyped.state,
  delawareDataTyped.state_slug,
);

const floridaFacilities = transformAlternateFormatFacilities(
  floridaDataTyped.facilities,
  floridaDataTyped.state,
  floridaDataTyped.state_slug,
);

export type RawFacility = {
  id: string;
  name: string;
  state: string;
  stateSlug: string;
  city: string;
  citySlug: string;
  addressLine1: string;
  addressLine2?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  mapsUrl?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  careTypes?: string[];
  featured?: boolean;
  premium?: boolean;
  recommended?: boolean;
  logo?: string | null;
  tagline?: string | null;
};

export type FacilityRecord = Facility & {
  id: string;
  state: string;
  stateSlug: string;
  city: string;
  citySlug: string;
  reviewCount?: number | null;
};

export type CitySummary = {
  citySlug: string;
  cityName: string;
  facilityCount: number;
  averageRating: number | null;
};

export type StateSummary = {
  stateSlug: string;
  stateName: string;
  facilities: FacilityRecord[];
  totalFacilities: number;
  cities: CitySummary[];
  averageRating: number | null;
  careTypes: string[];
};

const STATE_DATA: Record<string, RawFacility[]> = {
  alaska: alaskaFacilities,
  arizona: arizonaFacilities,
  arkansas: arkansasFacilities,
  connecticut: connecticutFacilities,
  delaware: delawareFacilities,
  florida: floridaFacilities,
};

const CANADIAN_REGION_SLUGS = new Set([
  "alberta",
  "british-columbia",
  "manitoba",
  "new-brunswick",
  "newfoundland-and-labrador",
  "nova-scotia",
  "ontario",
  "prince-edward-island",
  "quebec",
  "saskatchewan",
  "northwest-territories",
  "nunavut",
  "yukon",
]);

async function loadFacilitiesForState(
  stateSlug: string,
): Promise<RawFacility[]> {
  const normalized = (stateSlug ?? "").toLowerCase();
  return STATE_DATA[normalized] ?? [];
}

function toFacilityRecord(raw: RawFacility): FacilityRecord {
  const addressLines: string[] = [raw.addressLine1];
  if (raw.addressLine2) {
    addressLines.push(raw.addressLine2);
  }

  return {
    id: raw.id,
    name: raw.name,
    addressLines,
    phone: raw.phone ?? "Phone not listed",
    websiteUrl: raw.websiteUrl ?? undefined,
    mapsUrl: raw.mapsUrl ?? undefined,
    rating:
      typeof raw.rating === "number" && !Number.isNaN(raw.rating)
        ? raw.rating
        : undefined,
    careTypes: raw.careTypes ?? [],
    state: raw.state,
    stateSlug: raw.stateSlug,
    city: raw.city,
    citySlug: raw.citySlug,
    reviewCount: raw.reviewCount ?? undefined,
    featured: raw.featured ?? undefined,
    premium: raw.premium ?? undefined,
    recommended: raw.recommended ?? undefined,
    logo: raw.logo ?? undefined,
    tagline: raw.tagline ?? undefined,
  };
}

export async function getStateSummary(
  stateSlug: string,
): Promise<StateSummary> {
  const safeSlug = stateSlug ?? "";
  const rawFacilities = await loadFacilitiesForState(safeSlug);
  const facilities = rawFacilities.map(toFacilityRecord);

  const totalFacilities = facilities.length;

  const cityMap = new Map<
    string,
    {
      citySlug: string;
      cityName: string;
      facilityCount: number;
      ratingSum: number;
      ratingCount: number;
    }
  >();
  for (const facility of facilities) {
    const key = (facility.citySlug ?? "").toLowerCase();
    const existing = cityMap.get(key);
    const ratingValue =
      typeof facility.rating === "number" && facility.rating > 0
        ? facility.rating
        : null;

    if (existing) {
      existing.facilityCount += 1;
      if (ratingValue !== null) {
        existing.ratingSum += ratingValue;
        existing.ratingCount += 1;
      }
    } else {
      cityMap.set(key, {
        citySlug: facility.citySlug,
        cityName: facility.city,
        facilityCount: 1,
        ratingSum: ratingValue ?? 0,
        ratingCount: ratingValue !== null ? 1 : 0,
      });
    }
  }

  const cities: CitySummary[] = Array.from(cityMap.values())
    .map((city) => ({
      citySlug: city.citySlug,
      cityName: city.cityName,
      facilityCount: city.facilityCount,
      averageRating:
        city.ratingCount > 0
          ? Number((city.ratingSum / city.ratingCount).toFixed(1))
          : null,
    }))
    .sort((a, b) => a.cityName.localeCompare(b.cityName));

  const ratings = facilities
    .map((facility) => facility.rating)
    .filter(
      (rating): rating is number =>
        typeof rating === "number" && rating > 0 && !Number.isNaN(rating),
    );

  const averageRating =
    ratings.length > 0
      ? Number(
          (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length)
            .toFixed(1),
        )
      : null;

  const careTypes = Array.from(
    new Set(
      facilities
        .flatMap((facility) => facility.careTypes ?? [])
        .map((type) => type.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const normalizedSlug = safeSlug.toLowerCase();
  const stateNameFromData = facilities[0]?.state;
  const fallbackName =
    normalizedSlug.length > 0
      ? normalizedSlug[0]?.toUpperCase() + normalizedSlug.slice(1)
      : normalizedSlug;

  const stateName = stateNameFromData ?? fallbackName;

  return {
    stateSlug: normalizedSlug,
    stateName,
    facilities,
    totalFacilities,
    cities,
    averageRating,
    careTypes,
  };
}

export async function getCityFacilities(
  stateSlug: string,
  citySlug: string,
): Promise<{
  stateName: string;
  cityName: string;
  facilities: FacilityRecord[];
  totalFacilities: number;
  citiesCount: number;
}> {
  const safeState = stateSlug ?? "";
  const safeCity = citySlug ?? "";
  const stateSummary = await getStateSummary(safeState);
  const normalizedCity = safeCity.toLowerCase();

  const facilities = stateSummary.facilities.filter(
    (facility) => facility.citySlug.toLowerCase() === normalizedCity,
  );

  const cityNameFromData = facilities[0]?.city;
  const fallbackCityName =
    normalizedCity.length > 0
      ? normalizedCity[0]?.toUpperCase() + normalizedCity.slice(1)
      : normalizedCity;

  const cityName = cityNameFromData ?? fallbackCityName;

  return {
    stateName: stateSummary.stateName,
    cityName,
    facilities,
    totalFacilities: stateSummary.totalFacilities,
    citiesCount: stateSummary.cities.length,
  };
}

export async function getOtherCitiesInState(
  stateSlug: string,
  citySlug: string,
  limit = 6,
): Promise<CitySummary[]> {
  const summary = await getStateSummary(stateSlug);
  const cities = summary.cities;
  const targetSlug = (citySlug ?? "").toLowerCase();
  const currentIndex = cities.findIndex(
    (city) => city.citySlug.toLowerCase() === targetSlug,
  );

  const filtered = cities.filter(
    (city) => city.citySlug.toLowerCase() !== targetSlug,
  );
  if (currentIndex === -1) {
    return filtered.slice(0, limit);
  }

  const result: CitySummary[] = [];
  let left = currentIndex - 1;
  let right = currentIndex + 1;
  while (result.length < limit && (left >= 0 || right < cities.length)) {
    if (left >= 0) {
      const leftCity = cities[left];
      if (leftCity.citySlug.toLowerCase() !== targetSlug) {
        result.push(leftCity);
      }
      left -= 1;
    }
    if (result.length >= limit) break;
    if (right < cities.length) {
      const rightCity = cities[right];
      if (rightCity.citySlug.toLowerCase() !== targetSlug) {
        result.push(rightCity);
      }
      right += 1;
    }
  }

  return result.slice(0, limit);
}

export async function getDirectoryIndex(): Promise<
  { stateSlug: string; stateName: string; totalFacilities: number; cities: CitySummary[] }[]
> {
  const stateSlugs = Object.keys(STATE_DATA).sort();
  const summaries = await Promise.all(stateSlugs.map((slug) => getStateSummary(slug)));
  return summaries.map((summary) => ({
    stateSlug: summary.stateSlug,
    stateName: summary.stateName,
    totalFacilities: summary.totalFacilities,
    cities: summary.cities,
  }));
}

export type GlobalStats = {
  totalFacilities: number;
  totalCities: number;
  averageRating: number | null;
};

export function getGlobalStats(): GlobalStats {
  let totalFacilities = 0;
  const cityKeys = new Set<string>();
  const ratings: number[] = [];
  for (const facilities of Object.values(STATE_DATA)) {
    totalFacilities += facilities.length;
    for (const f of facilities) {
      cityKeys.add(`${f.stateSlug}:${f.citySlug}`);
      if (
        typeof f.rating === "number" &&
        !Number.isNaN(f.rating) &&
        f.rating > 0
      ) {
        ratings.push(f.rating);
      }
    }
  }
  const averageRating =
    ratings.length > 0
      ? Number(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        )
      : null;
  return {
    totalFacilities,
    totalCities: cityKeys.size,
    averageRating,
  };
}

export function getStateResourcesUrl(stateSlug: string): string {
  const normalized = stateSlug.toLowerCase();
  if (normalized === "alaska") {
    return "https://dhss.alaska.gov/dbh/Pages/default.aspx";
  }
  if (normalized === "arizona") {
    return "https://www.azahcccs.gov/";
  }
  if (normalized === "arkansas") {
    return "https://humanservices.arkansas.gov/divisions-shared-services/behavioral-health-services";
  }
  if (normalized === "connecticut") {
    return "https://portal.ct.gov/dph";
  }
  if (normalized === "delaware") {
    return "https://www.dhss.delaware.gov/dhss/dsamh/";
  }
  if (normalized === "florida") {
    return "https://www.myflorida.com/accessflorida/";
  }
  return "https://www.samhsa.gov/";
}

export function getHreflangForRegionSlug(
  regionSlug: string,
): "en-us" | "en-ca" {
  const normalized = (regionSlug ?? "").toLowerCase();
  return CANADIAN_REGION_SLUGS.has(normalized) ? "en-ca" : "en-us";
}
