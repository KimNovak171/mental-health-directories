export type Facility = {
  id?: string;
  name: string;
  addressLines: string[];
  phone: string;
  websiteUrl?: string;
  mapsUrl?: string;
  rating?: number;
  reviewCount?: number;
  careTypes?: string[];
  state?: string;
  city?: string;
  featured?: boolean;
  premium?: boolean;
  recommended?: boolean;
  logo?: string;
  tagline?: string;
};

type FacilityCardProps = {
  facility: Facility;
};

const getCareTypeColor = (type: string): string => {
  const normalized = type.toLowerCase();

  if (normalized.includes("mental health")) {
    return "#2A7F7F";
  }
  if (normalized.includes("therapy") || normalized.includes("therapist")) {
    return "#1976D2";
  }
  if (normalized.includes("counseling") || normalized.includes("counselor")) {
    return "#00695C";
  }
  if (normalized.includes("clinic")) {
    return "#0277BD";
  }
  if (normalized.includes("psychiatric") || normalized.includes("psychologist")) {
    return "#4A148C";
  }

  // Fallback to brand teal if unknown
  return "#2A7F7F";
};

function truncateToWords(text: string, maxWords: number): string {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return "";
  const words = trimmed.split(/\s+/);
  if (words.length <= maxWords) return trimmed;
  return words.slice(0, maxWords).join(" ") + "…";
}

/** Strip leading +1 or +1 space so phone displays as 213-385-1715 */
function normalizePhoneDisplay(phone: string): string {
  const s = (phone ?? "").trim();
  if (!s) return "Phone not listed";
  const withoutPlus1 = s.replace(/^\s*\+1\s*/i, "").trim();
  return withoutPlus1 || "Phone not listed";
}

const renderRating = (
  rating?: number,
  reviewCount?: number,
  mapsUrl?: string,
) => {
  if (!rating || rating <= 0) return null;

  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  const starsText = `${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`;
  const ratingText = `${Number(rating).toFixed(1)}★${
    typeof reviewCount === "number" && reviewCount > 0
      ? ` • ${reviewCount} review${reviewCount === 1 ? "" : "s"}`
      : ""
  }`;
  const content = (
    <>
      <span>{starsText}</span>
      <span className="ml-1 text-[15px]">{ratingText}</span>
    </>
  );

  if (!mapsUrl) {
    return (
      <div
        className="flex items-center gap-1 text-sm font-semibold text-gold"
        aria-label={`${Number(rating).toFixed(1)} out of 5 stars`}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-sm font-semibold text-gold underline underline-offset-2 hover:text-gold-soft"
      aria-label={`View ${Number(rating).toFixed(1)} star rating and reviews on Google Maps`}
    >
      {content}
    </a>
  );
};

export function FacilityCard({ facility }: FacilityCardProps) {
  const {
    id,
    name,
    addressLines,
    phone,
    websiteUrl,
    mapsUrl,
    rating,
    reviewCount,
    careTypes,
    state,
    city,
    featured,
    premium,
    recommended,
    logo,
    tagline,
  } = facility;
  const phoneDisplay = normalizePhoneDisplay(phone ?? "");
  const isFeatured = featured === true;
  const isRecommended = recommended === true;
  const showReviewCarefully = recommended === false;
  const isPremium = premium === true;
  const taglineDisplay =
    isPremium && tagline && tagline.trim()
      ? truncateToWords(tagline.trim(), 60)
      : "";
  const hasLogo = isPremium && logo && logo.trim().length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    telephone: normalizePhoneDisplay(phone ?? ""),
    ...(websiteUrl && { url: websiteUrl }),
    address: {
      "@type": "PostalAddress",
      streetAddress: addressLines[0],
      ...(city && { addressLocality: city }),
      ...(state && { addressRegion: state }),
    },
    ...(rating &&
      typeof rating === "number" &&
      !Number.isNaN(rating) && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating,
          bestRating: 5,
          worstRating: 0,
          ratingCount:
            typeof reviewCount === "number" && reviewCount >= 0
              ? reviewCount
              : 0,
          reviewCount:
            typeof reviewCount === "number" && reviewCount >= 0
              ? reviewCount
              : 0,
        },
      }),
    ...(id && { identifier: id }),
  };

  return (
    <article
      className={`relative flex flex-col gap-3 rounded-xl border border-surface-muted border-l-[4px] border-t border-t-[#2A7F7F] bg-[#F4F7FA] px-4 py-4 shadow-sm ${isFeatured ? "border-l-[#2A7F7F]" : "border-l-[#1B3A5C]"}`}
    >
      {isPremium && (
        <span
          className="absolute right-4 top-4 rounded-full border border-[#2A7F7F] bg-white px-2.5 py-0.5 text-xs font-semibold text-teal"
          aria-label="Premium listing"
        >
          Premium
        </span>
      )}
      {isFeatured && !isPremium && (
        <span
          className="absolute right-4 top-4 rounded-full bg-[#2A7F7F] px-2.5 py-0.5 text-xs font-semibold text-white"
          aria-label="Featured listing"
        >
          ⭐ Featured
        </span>
      )}
      {hasLogo && (
        <div className="flex justify-start">
          <img
            src={logo!.trim()}
            alt=""
            className="h-14 w-auto max-w-[180px] object-contain object-left"
          />
        </div>
      )}
      <div className={`flex flex-wrap items-start justify-between gap-2 ${isPremium ? "pr-16" : isFeatured ? "pr-20" : ""}`}>
        <h3 className="text-xl font-semibold leading-snug text-navy">
          {name}
        </h3>
        {renderRating(rating, reviewCount, mapsUrl)}
      </div>
      {(isRecommended || showReviewCarefully) && (
        <p className="text-xs font-medium">
          {isRecommended ? (
            <span className="inline-flex rounded-full bg-[#2E7D32] px-2.5 py-0.5 text-white">
              Recommended
            </span>
          ) : showReviewCarefully ? (
            <span className="inline-flex rounded-full bg-amber-600 px-2.5 py-0.5 text-white">
              Review carefully
            </span>
          ) : null}
        </p>
      )}
      {taglineDisplay && (
        <p className="border-l-2 border-teal bg-teal/5 px-3 py-2 text-[15px] leading-snug text-slate-700">
          {taglineDisplay}
        </p>
      )}

      {careTypes && careTypes.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {careTypes.map((type) => {
            const color = getCareTypeColor(type);
            return (
              <span
                key={type}
                className="inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: color }}
              >
                {type}
              </span>
            );
          })}
        </div>
      )}

      <div className="space-y-1 text-[15px] text-slate-700">
        {addressLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[15px]">
        <p className="font-semibold text-teal">{phoneDisplay}</p>
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
          >
            Visit website
          </a>
        )}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
          >
            🗺 View on Google Maps →
          </a>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}

