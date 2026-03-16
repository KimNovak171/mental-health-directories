import type { Facility } from "@/components/FacilityCard";
import floridaData from "@/data/florida_facilities.json";
import californiaData from "@/data/california_facilities.json";
import texasData from "@/data/texas_facilities.json";
import newYorkData from "@/data/new_york_facilities.json";
import arizonaData from "@/data/arizona_facilities.json";
import illinoisData from "@/data/illinois_facilities.json";
import ohioData from "@/data/ohio_facilities.json";
import michiganData from "@/data/michigan_facilities.json";
import southCarolinaData from "@/data/south_carolina_facilities.json";
import marylandData from "@/data/maryland_facilities.json";
import newMexicoData from "@/data/new_mexico_facilities.json";
import kansasData from "@/data/kansas_facilities.json";
import hawaiiData from "@/data/hawaii_facilities.json";
import wisconsinData from "@/data/wisconsin_facilities.json";
import missouriData from "@/data/missouri_facilities.json";
import indianaData from "@/data/indiana_facilities.json";
import northCarolinaData from "@/data/north_carolina_facilities.json";
import utahData from "@/data/utah_facilities.json";
import virginiaData from "@/data/virginia_facilities.json";
import nebraskaData from "@/data/nebraska_facilities.json";
import arkansasData from "@/data/arkansas_facilities.json";
import tennesseeData from "@/data/tennessee_facilities.json";
import kentuckyData from "@/data/kentucky_facilities.json";
import minnesotaData from "@/data/minnesota_facilities.json";
import idahoData from "@/data/idaho_facilities.json";
import newJerseyData from "@/data/new_jersey_facilities.json";
import connecticutData from "@/data/connecticut_facilities.json";
import coloradoData from "@/data/colorado_facilities.json";
import georgiaData from "@/data/georgia_facilities.json";
import nevadaData from "@/data/nevada_facilities.json";
import alabamaData from "@/data/alabama_facilities.json";
import louisianaData from "@/data/louisiana_facilities.json";
import oregonData from "@/data/oregon_facilities.json";
import newHampshireData from "@/data/new_hampshire_facilities.json";
import washingtonData from "@/data/washington_facilities.json";
import massachusettsData from "@/data/massachusetts_facilities.json";
import vermontData from "@/data/vermont_facilities.json";
import rhodeIslandData from "@/data/rhode_island_facilities.json";
import mississippiData from "@/data/mississippi_facilities.json";
import montanaData from "@/data/montana_facilities.json";
import washingtonDcData from "@/data/washington_dc_facilities.json";
import northDakotaData from "@/data/north_dakota_facilities.json";
import southDakotaData from "@/data/south_dakota_facilities.json";
import wyomingData from "@/data/wyoming_facilities.json";
import pennsylvaniaData from "@/data/pennsylvania_facilities.json";
import alaskaData from "@/data/alaska_facilities.json";
import delawareData from "@/data/delaware_facilities.json";
import westVirginiaData from "@/data/west_virginia_facilities.json";
import iowaData from "@/data/iowa_facilities.json";
import oklahomaData from "@/data/oklahoma_facilities.json";

type AlternateFormatFacilityRaw = {
  name: string;
  care_type?: string;
  type?: string;
  address: string;
  city: string;
  state: string;
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
      f.place_id ?
        `https://search.google.com/local/reviews?placeid=${f.place_id}&q=*&authuser=0&hl=en&gl=US`
      : undefined;
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
      careTypes: ["Mental health service"],
      featured: f.featured ?? undefined,
      premium: f.premium ?? undefined,
      recommended: f.recommended ?? undefined,
      logo: f.logo ?? undefined,
      tagline: f.tagline ?? undefined,
    };
  });
}

const floridaFacilities = transformAlternateFormatFacilities(
  floridaData as unknown as AlternateFormatFacilityRaw[],
  "Florida",
  "florida",
);

const texasFacilities = transformAlternateFormatFacilities(
  texasData as unknown as AlternateFormatFacilityRaw[],
  "Texas",
  "texas",
);

const californiaFacilities = transformAlternateFormatFacilities(
  californiaData as unknown as AlternateFormatFacilityRaw[],
  "California",
  "california",
);

const newYorkFacilities = transformAlternateFormatFacilities(
  newYorkData as unknown as AlternateFormatFacilityRaw[],
  "New York",
  "new-york",
);

const arizonaFacilities = transformAlternateFormatFacilities(
  (arizonaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (arizonaData as { state: string }).state,
  "arizona",
);

const illinoisFacilities = transformAlternateFormatFacilities(
  (illinoisData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (illinoisData as { state: string }).state,
  "illinois",
);

const ohioFacilities = transformAlternateFormatFacilities(
  (ohioData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (ohioData as { state: string }).state,
  "ohio",
);

const michiganFacilities = transformAlternateFormatFacilities(
  (michiganData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (michiganData as { state: string }).state,
  "michigan",
);

const southCarolinaFacilities = transformAlternateFormatFacilities(
  (southCarolinaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (southCarolinaData as { state: string }).state,
  "south-carolina",
);

const marylandFacilities = transformAlternateFormatFacilities(
  (marylandData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (marylandData as { state: string }).state,
  "maryland",
);

const newMexicoFacilities = transformAlternateFormatFacilities(
  (newMexicoData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (newMexicoData as { state: string }).state,
  "new-mexico",
);

const kansasFacilities = transformAlternateFormatFacilities(
  (kansasData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (kansasData as { state: string }).state,
  "kansas",
);

const hawaiiFacilities = transformAlternateFormatFacilities(
  (hawaiiData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (hawaiiData as { state: string }).state,
  "hawaii",
);

const wisconsinFacilities = transformAlternateFormatFacilities(
  (wisconsinData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (wisconsinData as { state: string }).state,
  "wisconsin",
);

const missouriFacilities = transformAlternateFormatFacilities(
  (missouriData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (missouriData as { state: string }).state,
  "missouri",
);

const indianaFacilities = transformAlternateFormatFacilities(
  (indianaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (indianaData as { state: string }).state,
  "indiana",
);

const northCarolinaFacilities = transformAlternateFormatFacilities(
  (northCarolinaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (northCarolinaData as { state: string }).state,
  "north-carolina",
);

const utahFacilities = transformAlternateFormatFacilities(
  (utahData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (utahData as { state: string }).state,
  "utah",
);

const virginiaFacilities = transformAlternateFormatFacilities(
  (virginiaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (virginiaData as { state: string }).state,
  "virginia",
);

const nebraskaFacilities = transformAlternateFormatFacilities(
  (nebraskaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (nebraskaData as { state: string }).state,
  "nebraska",
);

const arkansasFacilities = transformAlternateFormatFacilities(
  (arkansasData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (arkansasData as { state: string }).state,
  "arkansas",
);

const tennesseeFacilities = transformAlternateFormatFacilities(
  (tennesseeData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (tennesseeData as { state: string }).state,
  "tennessee",
);

const kentuckyFacilities = transformAlternateFormatFacilities(
  (kentuckyData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (kentuckyData as { state: string }).state,
  "kentucky",
);

const minnesotaFacilities = transformAlternateFormatFacilities(
  (minnesotaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (minnesotaData as { state: string }).state,
  "minnesota",
);

const idahoFacilities = transformAlternateFormatFacilities(
  (idahoData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (idahoData as { state: string }).state,
  "idaho",
);

const oklahomaFacilities = oklahomaData as unknown as RawFacility[];

const iowaFacilities = transformAlternateFormatFacilities(
  iowaData as unknown as AlternateFormatFacilityRaw[],
  "Iowa",
  "iowa",
);

const newJerseyFacilities = transformAlternateFormatFacilities(
  (newJerseyData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (newJerseyData as { state: string }).state,
  "new-jersey",
);

const connecticutFacilities = transformAlternateFormatFacilities(
  (connecticutData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (connecticutData as { state: string }).state,
  "connecticut",
);

const coloradoFacilities = transformAlternateFormatFacilities(
  (coloradoData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (coloradoData as { state: string }).state,
  "colorado",
);

const georgiaFacilities = transformAlternateFormatFacilities(
  (georgiaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (georgiaData as { state: string }).state,
  "georgia",
);

const nevadaFacilities = transformAlternateFormatFacilities(
  (nevadaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (nevadaData as { state: string }).state,
  "nevada",
);

const alabamaFacilities = transformAlternateFormatFacilities(
  (alabamaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (alabamaData as { state: string }).state,
  "alabama",
);

const louisianaFacilities = transformAlternateFormatFacilities(
  (louisianaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (louisianaData as { state: string }).state,
  "louisiana",
);

const oregonFacilities = transformAlternateFormatFacilities(
  (oregonData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (oregonData as { state: string }).state,
  "oregon",
);

const newHampshireFacilities = transformAlternateFormatFacilities(
  (newHampshireData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (newHampshireData as { state: string }).state,
  "new-hampshire",
);

const washingtonFacilities = transformAlternateFormatFacilities(
  (washingtonData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (washingtonData as { state: string }).state,
  "washington",
);

const massachusettsFacilities = transformAlternateFormatFacilities(
  (massachusettsData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (massachusettsData as { state: string }).state,
  "massachusetts",
);

const vermontFacilities = transformAlternateFormatFacilities(
  (vermontData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (vermontData as { state: string }).state,
  "vermont",
);

const rhodeIslandFacilities = transformAlternateFormatFacilities(
  (rhodeIslandData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (rhodeIslandData as { state: string }).state,
  "rhode-island",
);

const mississippiFacilities = transformAlternateFormatFacilities(
  (mississippiData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (mississippiData as { state: string }).state,
  "mississippi",
);

const montanaFacilities = transformAlternateFormatFacilities(
  (montanaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (montanaData as { state: string }).state,
  "montana",
);

const washingtonDcFacilities = transformAlternateFormatFacilities(
  (washingtonDcData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (washingtonDcData as { state: string }).state,
  "washington-dc",
);

const northDakotaFacilities = transformAlternateFormatFacilities(
  (northDakotaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (northDakotaData as { state: string }).state,
  "north-dakota",
);

const southDakotaFacilities = transformAlternateFormatFacilities(
  (southDakotaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (southDakotaData as { state: string }).state,
  "south-dakota",
);

const wyomingFacilities = transformAlternateFormatFacilities(
  (wyomingData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (wyomingData as { state: string }).state,
  "wyoming",
);

const pennsylvaniaFacilities = transformAlternateFormatFacilities(
  (pennsylvaniaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (pennsylvaniaData as { state: string }).state,
  "pennsylvania",
);

const alaskaFacilities = transformAlternateFormatFacilities(
  (alaskaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (alaskaData as { state: string }).state,
  "alaska",
);

const delawareFacilities = transformAlternateFormatFacilities(
  (delawareData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (delawareData as { state: string }).state,
  "delaware",
);

const westVirginiaFacilities = transformAlternateFormatFacilities(
  (westVirginiaData as { facilities: AlternateFormatFacilityRaw[]; state: string }).facilities,
  (westVirginiaData as { state: string }).state,
  "west-virginia",
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
  florida: floridaFacilities,
  hawaii: hawaiiFacilities,
  california: californiaFacilities,
  texas: texasFacilities,
  "new-york": newYorkFacilities,
  arizona: arizonaFacilities,
  alabama: alabamaFacilities,
  alaska: alaskaFacilities,
  arkansas: arkansasFacilities,
  colorado: coloradoFacilities,
  connecticut: connecticutFacilities,
  delaware: delawareFacilities,
  illinois: illinoisFacilities,
  indiana: indianaFacilities,
  idaho: idahoFacilities,
  iowa: iowaFacilities,
  georgia: georgiaFacilities,
  kansas: kansasFacilities,
  kentucky: kentuckyFacilities,
  louisiana: louisianaFacilities,
  maryland: marylandFacilities,
  massachusetts: massachusettsFacilities,
  michigan: michiganFacilities,
  minnesota: minnesotaFacilities,
  mississippi: mississippiFacilities,
  missouri: missouriFacilities,
  montana: montanaFacilities,
  nebraska: nebraskaFacilities,
  "new-hampshire": newHampshireFacilities,
  "new-mexico": newMexicoFacilities,
  "north-carolina": northCarolinaFacilities,
  "north-dakota": northDakotaFacilities,
  ohio: ohioFacilities,
  oklahoma: oklahomaFacilities,
  oregon: oregonFacilities,
  pennsylvania: pennsylvaniaFacilities,
  "rhode-island": rhodeIslandFacilities,
  "south-carolina": southCarolinaFacilities,
  "south-dakota": southDakotaFacilities,
  tennessee: tennesseeFacilities,
  utah: utahFacilities,
  vermont: vermontFacilities,
  virginia: virginiaFacilities,
  washington: washingtonFacilities,
  "washington-dc": washingtonDcFacilities,
  "west-virginia": westVirginiaFacilities,
  wisconsin: wisconsinFacilities,
  wyoming: wyomingFacilities,
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
  if (normalized === "california") {
    return "https://aging.ca.gov/";
  }
  if (normalized === "florida") {
    return "https://elderaffairs.org/";
  }
  if (normalized === "texas") {
    return "https://www.hhs.texas.gov/";
  }
  if (normalized === "new-york") {
    return "https://aging.ny.gov/";
  }
  if (normalized === "arizona") {
    return "https://des.az.gov/aging-adult-services";
  }
  if (normalized === "illinois") {
    return "https://aging.illinois.gov/";
  }
  if (normalized === "michigan") {
    return "https://www.michigan.gov/mdhhs/adult-adult-senior";
  }
  if (normalized === "ohio") {
    return "https://aging.ohio.gov/";
  }
  if (normalized === "south-carolina") {
    return "https://aging.sc.gov/";
  }
  if (normalized === "maryland") {
    return "https://aging.maryland.gov/";
  }
  if (normalized === "new-mexico") {
    return "https://aging.nm.gov/";
  }
  if (normalized === "kansas") {
    return "https://aging.kdads.ks.gov/";
  }
  if (normalized === "hawaii") {
    return "https://health.hawaii.gov/aging/";
  }
  if (normalized === "wisconsin") {
    return "https://www.dhs.wisconsin.gov/aging/";
  }
  if (normalized === "missouri") {
    return "https://health.mo.gov/seniors/";
  }
  if (normalized === "indiana") {
    return "https://www.in.gov/fssa/da/3479.htm";
  }
  if (normalized === "north-carolina") {
    return "https://www.ncdhhs.gov/divisions/aging-and-adult-services";
  }
  if (normalized === "utah") {
    return "https://aging.utah.gov/";
  }
  if (normalized === "virginia") {
    return "https://www.dss.virginia.gov/";
  }
  if (normalized === "nebraska") {
    return "https://dhhs.ne.gov/Pages/aging.aspx";
  }
  if (normalized === "arkansas") {
    return "https://humanservices.arkansas.gov/divisions-shared-services/aging-adult-and-behavioral-health-services";
  }
  if (normalized === "tennessee") {
    return "https://www.tn.gov/aging.html";
  }
  if (normalized === "kentucky") {
    return "https://chfs.ky.gov/agencies/dail/Pages/default.aspx";
  }
  if (normalized === "minnesota") {
    return "https://mn.gov/dhs/people-we-serve/seniors/";
  }
  if (normalized === "idaho") {
    return "https://aging.idaho.gov/";
  }
  if (normalized === "new-jersey") {
    return "https://www.nj.gov/health/senior/";
  }
  if (normalized === "new-hampshire") {
    return "https://www.dhhs.nh.gov/programs/elderly-adult-services";
  }
  if (normalized === "connecticut") {
    return "https://portal.ct.gov/aging";
  }
  if (normalized === "colorado") {
    return "https://aging.colorado.gov/";
  }
  if (normalized === "georgia") {
    return "https://dhs.georgia.gov/division-aging-services";
  }
  if (normalized === "nevada") {
    return "https://aging.nv.gov/";
  }
  if (normalized === "alabama") {
    return "https://alabamaageline.gov/";
  }
  if (normalized === "louisiana") {
    return "https://ldaf.state.la.us/aging-adult-services/";
  }
  if (normalized === "oregon") {
    return "https://www.oregon.gov/dhs/SENIORS-DISABILITIES/Pages/index.aspx";
  }
  if (normalized === "washington") {
    return "https://www.dshs.wa.gov/aging-and-long-term-support-administration";
  }
  if (normalized === "massachusetts") {
    return "https://www.mass.gov/orgs/executive-office-of-elder-affairs";
  }
  if (normalized === "vermont") {
    return "https://www.vermont.gov/agency/das";
  }
  return "https://www.usa.gov/senior-health";
}

export function getHreflangForRegionSlug(
  regionSlug: string,
): "en-us" | "en-ca" {
  const normalized = (regionSlug ?? "").toLowerCase();
  return CANADIAN_REGION_SLUGS.has(normalized) ? "en-ca" : "en-us";
}

