import type { Facility } from "@/components/FacilityCard";

import britishColumbiaData from "@/data/british-columbia_facilities.json";
import manitobaData from "@/data/manitoba_facilities.json";
import northwestTerritoriesData from "@/data/northwest-territories_facilities.json";
import nunavutData from "@/data/nunavut_facilities.json";
import ontarioData from "@/data/ontario_facilities.json";
import quebecData from "@/data/quebec_facilities.json";
import saskatchewanData from "@/data/saskatchewan_facilities.json";
import yukonData from "@/data/yukon_facilities.json";

export type CanadaRawFacility = {
  id: string;
  name: string;
  province: string;
  provinceSlug: string;
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

export type CanadaFacilityRecord = Facility & {
  id: string;
  state: string;
  stateSlug: string;
  city: string;
  citySlug: string;
  reviewCount?: number | null;
};

export type ProvinceCitySummary = {
  citySlug: string;
  cityName: string;
  facilityCount: number;
  averageRating: number | null;
};

export type ProvinceSummary = {
  provinceSlug: string;
  provinceName: string;
  facilities: CanadaFacilityRecord[];
  totalFacilities: number;
  cities: ProvinceCitySummary[];
  averageRating: number | null;
  careTypes: string[];
};

export type CanadaDirectoryItem = {
  provinceSlug: string;
  provinceName: string;
  totalFacilities: number;
  cities: { citySlug: string; cityName: string }[];
};

type CanadaAlternateFacilityRaw = {
  name: string;
  category?: string;
  care_type?: string;
  type?: string;
  address: string;
  city: string;
  province: string;
  province_code?: string;
  country?: string;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  reviews?: number | null;
  reviews_link?: string | null;
  recommended?: boolean;
};

function slugify(input: string): string {
  return (input ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePhone(phone?: string | null): string | null {
  const p = (phone ?? "").toString().trim();
  return p.length > 0 ? p : null;
}

function normalizeUrl(url?: string | null): string | null {
  const u = (url ?? "").toString().trim();
  return u.length > 0 ? u : null;
}

function toGoogleMapsSearchUrl(query: string): string {
  const q = (query ?? "").toString().trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function buildRawFacilitiesForProvince(
  provinceSlug: string,
  facilities: CanadaAlternateFacilityRaw[],
): CanadaRawFacility[] {
  const usedIds = new Map<string, number>();

  return (facilities ?? []).map((f, idx) => {
    const name = (f.name ?? "").toString().trim() || "Unnamed listing";
    const provinceName = (f.province ?? provinceSlug).toString().trim() || provinceSlug;
    const cityName = (f.city ?? "").toString().trim();
    const citySlug = cityName ? slugify(cityName) : "unknown";

    const address = (f.address ?? "").toString().trim();
    const addressLine1 = address.length > 0 ? address : "Address not listed";

    const careTypeSource = ((f.category ?? f.care_type ?? f.type) ?? "")
      .toString()
      .trim();
    const careTypes = careTypeSource.length > 0 ? [careTypeSource] : ["Mental health service"];

    const mapsUrl =
      normalizeUrl(f.reviews_link) ??
      toGoogleMapsSearchUrl(
        `${name} ${addressLine1} ${cityName} ${provinceName} Canada`,
      );
    const websiteUrl = normalizeUrl(f.website);

    const baseId = `${provinceSlug}:${slugify(f.name ?? "")}:${slugify(addressLine1)}`.replace(
      /-+/g,
      "-",
    );
    const seen = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, seen + 1);
    const id = seen === 0 ? baseId : `${baseId}-${seen + 1}`;

    return {
      id: id.length > 0 ? id : `${provinceSlug}:${idx}`,
      name,
      province: provinceName,
      provinceSlug,
      city: cityName || "Unknown",
      citySlug,
      addressLine1,
      addressLine2: null,
      phone: normalizePhone(f.phone),
      websiteUrl,
      mapsUrl,
      rating:
        typeof f.rating === "number" && !Number.isNaN(f.rating) ? f.rating : null,
      reviewCount:
        typeof f.reviews === "number" && !Number.isNaN(f.reviews) ? f.reviews : null,
      careTypes,
      recommended: f.recommended === true,
    };
  });
}

const PROVINCE_DATA: Record<string, CanadaRawFacility[]> = {
  "british-columbia": buildRawFacilitiesForProvince(
    "british-columbia",
    britishColumbiaData as CanadaAlternateFacilityRaw[],
  ),
  manitoba: buildRawFacilitiesForProvince(
    "manitoba",
    manitobaData as CanadaAlternateFacilityRaw[],
  ),
  "northwest-territories": buildRawFacilitiesForProvince(
    "northwest-territories",
    northwestTerritoriesData as CanadaAlternateFacilityRaw[],
  ),
  nunavut: buildRawFacilitiesForProvince(
    "nunavut",
    nunavutData as CanadaAlternateFacilityRaw[],
  ),
  ontario: buildRawFacilitiesForProvince(
    "ontario",
    ontarioData as CanadaAlternateFacilityRaw[],
  ),
  quebec: buildRawFacilitiesForProvince(
    "quebec",
    quebecData as CanadaAlternateFacilityRaw[],
  ),
  saskatchewan: buildRawFacilitiesForProvince(
    "saskatchewan",
    saskatchewanData as CanadaAlternateFacilityRaw[],
  ),
  yukon: buildRawFacilitiesForProvince(
    "yukon",
    yukonData as CanadaAlternateFacilityRaw[],
  ),
};

function toCanadaFacilityRecord(raw: CanadaRawFacility): CanadaFacilityRecord {
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
    state: raw.province,
    stateSlug: raw.provinceSlug,
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

export async function getProvinceSummary(
  provinceSlug: string,
): Promise<ProvinceSummary> {
  const safeSlug = (provinceSlug ?? "").toLowerCase();
  const rawFacilities = PROVINCE_DATA[safeSlug] ?? [];
  const facilities = rawFacilities.map(toCanadaFacilityRecord);

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
    const key = facility.citySlug.toLowerCase();
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

  const cities: ProvinceCitySummary[] = Array.from(cityMap.values())
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
    .map((f) => f.rating)
    .filter(
      (rating): rating is number =>
        typeof rating === "number" && rating > 0 && !Number.isNaN(rating),
    );
  const averageRating =
    ratings.length > 0
      ? Number(
          (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1),
        )
      : null;

  const careTypes = Array.from(
    new Set(
      facilities
        .flatMap((f) => f.careTypes ?? [])
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const provinceName = facilities[0]?.state ?? safeSlug;

  return {
    provinceSlug: safeSlug,
    provinceName,
    facilities,
    totalFacilities: facilities.length,
    cities,
    averageRating,
    careTypes,
  };
}

export async function getCanadaCityFacilities(
  provinceSlug: string,
  citySlug: string,
): Promise<{
  provinceName: string;
  cityName: string;
  facilities: CanadaFacilityRecord[];
  totalFacilities: number;
  citiesCount: number;
}> {
  const summary = await getProvinceSummary(provinceSlug ?? "");
  const normalizedCity = (citySlug ?? "").toLowerCase();
  const facilities = summary.facilities.filter(
    (f) => f.citySlug.toLowerCase() === normalizedCity,
  );
  const cityName =
    facilities[0]?.city ??
    (normalizedCity.length > 0
      ? normalizedCity[0].toUpperCase() + normalizedCity.slice(1)
      : normalizedCity);

  return {
    provinceName: summary.provinceName,
    cityName,
    facilities,
    totalFacilities: summary.totalFacilities,
    citiesCount: summary.cities.length,
  };
}

export async function getCanadaDirectoryIndex(): Promise<CanadaDirectoryItem[]> {
  const slugs = Object.keys(PROVINCE_DATA);
  const result: CanadaDirectoryItem[] = [];
  for (const slug of slugs) {
    const summary = await getProvinceSummary(slug);
    result.push({
      provinceSlug: summary.provinceSlug,
      provinceName: summary.provinceName,
      totalFacilities: summary.totalFacilities,
      cities: summary.cities.map((c) => ({
        citySlug: c.citySlug,
        cityName: c.cityName,
      })),
    });
  }
  result.sort((a, b) => a.provinceName.localeCompare(b.provinceName));
  return result;
}

export type CanadaGlobalStats = {
  totalFacilities: number;
  totalCities: number;
  averageRating: number | null;
};

export function getCanadaGlobalStats(): CanadaGlobalStats {
  let totalFacilities = 0;
  const cityKeys = new Set<string>();
  const ratings: number[] = [];

  for (const [provinceSlug, facilities] of Object.entries(PROVINCE_DATA)) {
    totalFacilities += facilities.length;
    for (const f of facilities) {
      cityKeys.add(`${provinceSlug}:${(f.citySlug ?? "").toLowerCase()}`);
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
          (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1),
        )
      : null;

  return {
    totalFacilities,
    totalCities: cityKeys.size,
    averageRating,
  };
}

export async function getOtherCitiesInProvince(
  provinceSlug: string,
  currentCitySlug: string,
  limit = 6,
): Promise<ProvinceCitySummary[]> {
  const summary = await getProvinceSummary(provinceSlug ?? "");
  const cities = summary.cities;
  const targetSlug = (currentCitySlug ?? "").toLowerCase();
  const currentIndex = cities.findIndex(
    (c) => c.citySlug.toLowerCase() === targetSlug,
  );
  const filtered = cities.filter(
    (c) => c.citySlug.toLowerCase() !== targetSlug,
  );
  if (currentIndex === -1) return filtered.slice(0, limit);

  const result: ProvinceCitySummary[] = [];
  let left = currentIndex - 1;
  let right = currentIndex + 1;
  while (result.length < limit && (left >= 0 || right < cities.length)) {
    if (left >= 0) {
      result.push(cities[left]);
      left--;
    }
    if (result.length < limit && right < cities.length) {
      result.push(cities[right]);
      right++;
    }
  }
  return result.slice(0, limit);
}
