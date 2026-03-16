import type { Facility } from "@/components/FacilityCard";
import britishColumbiaData from "@/data/british_columbia_facilities.json";
import albertaData from "@/data/alberta_facilities.json";
import saskatchewanData from "@/data/saskatchewan_facilities.json";
import manitobaData from "@/data/manitoba_facilities.json";
import ontarioData from "@/data/ontario_facilities.json";
import novaScotiaData from "@/data/nova_scotia_facilities.json";
import newBrunswickData from "@/data/new_brunswick_facilities.json";
import princeEdwardIslandData from "@/data/prince_edward_island_facilities.json";
import northwestTerritoriesData from "@/data/northwest_territories_facilities.json";
import yukonData from "@/data/yukon_facilities.json";
import nunavutData from "@/data/nunavut_facilities.json";
import newfoundlandAndLabradorData from "@/data/newfoundland_and_labrador_facilities.json";
import quebecData from "@/data/quebec_facilities.json";

type CanadaFacilityRaw = {
  name: string;
  care_type: string;
  address: string;
  city: string;
  province: string;
  country: string;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  reviews?: number | null;
  place_id?: string | null;
  recommended?: boolean;
  featured?: boolean;
  premium?: boolean;
  logo?: string | null;
  tagline?: string | null;
};

type CanadaJson = {
  province: string;
  country: string;
  facilities: CanadaFacilityRaw[];
};

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

/** Normalize accented characters (e.g. é, è, ô) to ASCII for URL-safe slugs (Quebec data). */
function normalizeForSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slugify(text: string | null | undefined): string {
  return normalizeForSlug((text ?? "").trim())
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function transformCanadaFacilities(
  facilities: CanadaFacilityRaw[],
  provinceName: string,
  provinceSlug: string,
): CanadaRawFacility[] {
  const valid = facilities.filter((f) => (f.city ?? "").trim() !== "");
  return valid.map((f, index) => {
    const citySlug = slugify(f.city);
    const nameSlug = slugify(f.name);
    const id = `ca-${provinceSlug}-${nameSlug}-${citySlug}-${index}`;
    const addressParts = (f.address || "").split(",").map((s) => s.trim());
    const addressLine1 = addressParts[0] ?? f.address ?? "";
    const addressLine2 =
      addressParts.length > 1 ? addressParts.slice(1).join(", ") : undefined;
    const mapsUrl = f.place_id
      ? `https://search.google.com/local/reviews?placeid=${f.place_id}&q=*&authuser=0&hl=en&gl=CA`
      : undefined;
    return {
      id,
      name: f.name,
      province: provinceName,
      provinceSlug,
      city: f.city,
      citySlug,
      addressLine1,
      addressLine2: addressLine2 || null,
      phone: f.phone ?? null,
      websiteUrl: f.website ?? null,
      mapsUrl: mapsUrl ?? null,
      rating: f.rating ?? null,
      reviewCount: f.reviews ?? null,
      careTypes: ["Mental health service"],
      featured: f.featured ?? undefined,
      premium: f.premium ?? undefined,
      recommended: f.recommended ?? undefined,
      logo: f.logo ?? undefined,
      tagline: f.tagline ?? undefined,
    };
  });
}

const britishColumbiaFacilities = transformCanadaFacilities(
  (britishColumbiaData as CanadaJson).facilities,
  (britishColumbiaData as CanadaJson).province,
  "british-columbia",
);
const albertaFacilities = transformCanadaFacilities(
  (albertaData as CanadaJson).facilities,
  (albertaData as CanadaJson).province,
  "alberta",
);
const saskatchewanFacilities = transformCanadaFacilities(
  (saskatchewanData as CanadaJson).facilities,
  (saskatchewanData as CanadaJson).province,
  "saskatchewan",
);
const manitobaFacilities = transformCanadaFacilities(
  (manitobaData as CanadaJson).facilities,
  (manitobaData as CanadaJson).province,
  "manitoba",
);
const ontarioFacilities = transformCanadaFacilities(
  (ontarioData as CanadaJson).facilities,
  (ontarioData as CanadaJson).province,
  "ontario",
);
const novaScotiaFacilities = transformCanadaFacilities(
  (novaScotiaData as CanadaJson).facilities,
  (novaScotiaData as CanadaJson).province,
  "nova-scotia",
);
const newBrunswickFacilities = transformCanadaFacilities(
  (newBrunswickData as CanadaJson).facilities,
  (newBrunswickData as CanadaJson).province,
  "new-brunswick",
);
const princeEdwardIslandFacilities = transformCanadaFacilities(
  (princeEdwardIslandData as CanadaJson).facilities,
  (princeEdwardIslandData as CanadaJson).province,
  "prince-edward-island",
);
const northwestTerritoriesFacilities = transformCanadaFacilities(
  (northwestTerritoriesData as CanadaJson).facilities,
  (northwestTerritoriesData as CanadaJson).province,
  "northwest-territories",
);
const yukonFacilities = transformCanadaFacilities(
  (yukonData as CanadaJson).facilities,
  (yukonData as CanadaJson).province,
  "yukon",
);
const nunavutFacilities = transformCanadaFacilities(
  (nunavutData as CanadaJson).facilities,
  (nunavutData as CanadaJson).province,
  "nunavut",
);
const newfoundlandAndLabradorFacilities = transformCanadaFacilities(
  (newfoundlandAndLabradorData as CanadaJson).facilities,
  (newfoundlandAndLabradorData as CanadaJson).province,
  "newfoundland-and-labrador",
);
const quebecFacilities = transformCanadaFacilities(
  quebecData as unknown as CanadaFacilityRaw[],
  "Quebec",
  "quebec",
);

const PROVINCE_DATA: Record<string, CanadaRawFacility[]> = {
  alberta: albertaFacilities,
  "british-columbia": britishColumbiaFacilities,
  manitoba: manitobaFacilities,
  "new-brunswick": newBrunswickFacilities,
  "newfoundland-and-labrador": newfoundlandAndLabradorFacilities,
  "northwest-territories": northwestTerritoriesFacilities,
  "nova-scotia": novaScotiaFacilities,
  nunavut: nunavutFacilities,
  ontario: ontarioFacilities,
  "prince-edward-island": princeEdwardIslandFacilities,
  quebec: quebecFacilities,
  saskatchewan: saskatchewanFacilities,
  yukon: yukonFacilities,
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
    totalFacilities,
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
