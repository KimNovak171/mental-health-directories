#!/usr/bin/env python3
"""
Mental Health Directories — Outscraper Data Processing Script
Usage: python process_mental_health.py <input.xlsx> <state_code>
Example: python process_mental_health.py Outscraper-florida.xlsx FL

Output: <state_slug>_facilities.json in the current directory
Place output files in: C:\\Users\\Kim\\Dropbox\\Projects\\mental-health-directories\\data\\
"""

import sys
import json
import unicodedata
import pandas as pd
from pathlib import Path

# ── Configuration ─────────────────────────────────────────────────────────────

# Categories to KEEP (all mental health related)
KEEP_CATEGORIES = {
    "mental health service",
    "mental health clinic",
    "counselor",
    "psychotherapist",
    "psychologist",
    "psychiatrist",
    "child psychiatrist",
    "psychiatric hospital",
    "addiction treatment center",
    "marriage or relationship counselor",
    "family counselor",
    "nurse practitioner",
    "wellness center",
    "social worker",
    "life coach",
    "applied behavior analysis therapist",
    "emdr psychotherapist",
    "rehabilitation center",
    "domestic abuse treatment center",
    "disability services and support organization",
    "doctor",  # only if mental health context — filtered by category field
    "medical office",
    "health consultant",
}

# Categories to EXCLUDE
EXCLUDE_CATEGORIES = {
    "library",
    "family service center",
    "non-profit organization",
    "youth center",
    "community health center",
    "medical clinic",
    "medical center",
    "corporate office",
    "homeless service",
    "psychic",
    "musician",
    "call center",
    "association / organization",
    "men's health physician",
    "physical therapy clinic",
    "group home",
    "public health department",
    "social services organization",
    "educational consultant",
}

# State slug map
STATE_SLUGS = {
    "AL": "alabama", "AK": "alaska", "AZ": "arizona", "AR": "arkansas",
    "CA": "california", "CO": "colorado", "CT": "connecticut", "DE": "delaware",
    "FL": "florida", "GA": "georgia", "HI": "hawaii", "ID": "idaho",
    "IL": "illinois", "IN": "indiana", "IA": "iowa", "KS": "kansas",
    "KY": "kentucky", "LA": "louisiana", "ME": "maine", "MD": "maryland",
    "MA": "massachusetts", "MI": "michigan", "MN": "minnesota", "MS": "mississippi",
    "MO": "missouri", "MT": "montana", "NE": "nebraska", "NV": "nevada",
    "NH": "new-hampshire", "NJ": "new-jersey", "NM": "new-mexico", "NY": "new-york",
    "NC": "north-carolina", "ND": "north-dakota", "OH": "ohio", "OK": "oklahoma",
    "OR": "oregon", "PA": "pennsylvania", "RI": "rhode-island", "SC": "south-carolina",
    "SD": "south-dakota", "TN": "tennessee", "TX": "texas", "UT": "utah",
    "VT": "vermont", "VA": "virginia", "WA": "washington", "WV": "west-virginia",
    "WI": "wisconsin", "WY": "wyoming", "DC": "washington-dc",
    # Canadian provinces
    "ON": "ontario", "QC": "quebec", "BC": "british-columbia", "AB": "alberta",
    "MB": "manitoba", "SK": "saskatchewan", "NS": "nova-scotia", "NB": "new-brunswick",
    "NL": "newfoundland-and-labrador", "PE": "prince-edward-island",
    "NT": "northwest-territories", "YT": "yukon", "NU": "nunavut",
}

STATE_NAMES = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
    "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho",
    "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas",
    "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
    "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
    "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
    "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
    "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah",
    "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia",
    "WI": "Wisconsin", "WY": "Wyoming", "DC": "Washington DC",
    "ON": "Ontario", "QC": "Quebec", "BC": "British Columbia", "AB": "Alberta",
    "MB": "Manitoba", "SK": "Saskatchewan", "NS": "Nova Scotia", "NB": "New Brunswick",
    "NL": "Newfoundland and Labrador", "PE": "Prince Edward Island",
    "NT": "Northwest Territories", "YT": "Yukon", "NU": "Nunavut",
}

# ── Helper functions ──────────────────────────────────────────────────────────

def normalize_text(text):
    """Normalize unicode text (handles accents, special chars)."""
    if not isinstance(text, str):
        return ""
    return unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii").strip()

def clean_phone(phone):
    """Strip +1 from phone numbers."""
    if not isinstance(phone, str):
        return ""
    return phone.strip().lstrip("+1").strip() if phone.startswith("+1") else phone.strip()

def is_recommended(rating):
    """Recommended if rating >= 3.0, Review Carefully if below or no rating."""
    try:
        return float(rating) >= 3.0
    except (TypeError, ValueError):
        return False

def city_to_slug(city):
    """Convert city name to URL slug."""
    return normalize_text(city).lower().replace(" ", "-").replace("'", "").replace(".", "")

def should_keep(category):
    """Determine if a category should be kept."""
    if not isinstance(category, str):
        return False
    cat_lower = category.lower().strip()
    # Explicit exclude list takes priority
    if cat_lower in EXCLUDE_CATEGORIES:
        return False
    # Keep if in keep list
    if cat_lower in KEEP_CATEGORIES:
        return True
    # Keep anything with 'mental health' in the name
    if "mental health" in cat_lower:
        return True
    # Keep therapy/counseling related
    if any(word in cat_lower for word in ["therapist", "therapy", "counselor", "counseling", "psychiatr", "psycholog", "psychotherap"]):
        return True
    # Default: exclude if not recognized
    return False

# ── Main processing ───────────────────────────────────────────────────────────

def process(input_file, state_code):
    state_code = state_code.upper()
    
    if state_code not in STATE_SLUGS:
        print(f"ERROR: Unknown state code '{state_code}'")
        sys.exit(1)

    state_slug = STATE_SLUGS[state_code]
    state_name = STATE_NAMES[state_code]

    print(f"\nProcessing {state_name} ({state_code}) from {input_file}...")

    # Load data
    df = pd.read_excel(input_file)
    print(f"  Total rows in file: {len(df)}")

    # Filter to target state only
    df = df[df["state_code"] == state_code].copy()
    print(f"  Rows for {state_code}: {len(df)}")

    # Filter categories
    df = df[df["category"].apply(should_keep)].copy()
    print(f"  After category filter: {len(df)}")

    # Deduplicate on name + address
    df = df.drop_duplicates(subset=["name", "address"]).copy()
    print(f"  After deduplication: {len(df)}")

    # Build facility records
    facilities = []
    for _, row in df.iterrows():
        name = normalize_text(str(row.get("name", "")) or "Unknown")
        if not name:
            name = "Unknown"

        address = normalize_text(str(row.get("address", "") or ""))
        street = normalize_text(str(row.get("street", "") or ""))
        city = normalize_text(str(row.get("city", "") or ""))
        phone = clean_phone(str(row.get("phone", "") or ""))
        website = str(row.get("website", "") or "").strip()
        category = normalize_text(str(row.get("category", "") or ""))

        # Rating
        try:
            rating = float(row.get("rating"))
            if pd.isna(rating):
                rating = None
        except (TypeError, ValueError):
            rating = None

        # Reviews
        try:
            reviews = int(row.get("reviews"))
            if pd.isna(reviews):
                reviews = None
        except (TypeError, ValueError):
            reviews = None

        # Reviews link
        reviews_link = str(row.get("reviews_link", "") or "").strip()

        recommended = is_recommended(rating)

        facility = {
            "name": name,
            "category": category,
            "address": address,
            "street": street,
            "city": city,
            "state": state_name,
            "state_code": state_code,
            "phone": phone,
            "website": website if website and website != "nan" else "",
            "rating": rating,
            "reviews": reviews,
            "reviews_link": reviews_link if reviews_link and reviews_link != "nan" else "",
            "recommended": recommended,
        }
        facilities.append(facility)

    # Sort: city ASC, rating DESC (None last)
    facilities.sort(key=lambda x: (
        x["city"].lower(),
        -(x["rating"] if x["rating"] is not None else -999)
    ))

    # Build output structure
    cities = sorted(set(f["city"] for f in facilities if f["city"]))
    output = {
        "state": state_name,
        "state_code": state_code,
        "state_slug": state_slug,
        "total_facilities": len(facilities),
        "total_cities": len(cities),
        "cities": cities,
        "facilities": facilities,
    }

    # Stats
    rated = [f["rating"] for f in facilities if f["rating"] is not None]
    avg_rating = round(sum(rated) / len(rated), 2) if rated else 0
    with_website = sum(1 for f in facilities if f["website"])
    recommended_count = sum(1 for f in facilities if f["recommended"])

    print(f"  ✅ {len(facilities)} facilities | {len(cities)} cities")
    print(f"  ✅ Avg rating: {avg_rating} | With website: {with_website} | Recommended: {recommended_count}")

    # Save JSON
    output_filename = f"{state_slug}_facilities.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"  ✅ Saved: {output_filename}")
    print(f"\nPlace this file in:")
    print(f"  C:\\Users\\Kim\\Dropbox\\Projects\\mental-health-directories\\data\\")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python process_mental_health.py <input.xlsx> <state_code>")
        print("Example: python process_mental_health.py Outscraper-florida.xlsx FL")
        sys.exit(1)
    process(sys.argv[1], sys.argv[2])
