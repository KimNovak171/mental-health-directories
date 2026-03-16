import type { Metadata } from "next";
import Link from "next/link";
import { getCanadaDirectoryIndex } from "@/lib/canadaFacilities";

const siteUrl = "https://mentalhealthdirectories.com";

export const metadata: Metadata = {
  title: "Mental Health in Canada | Provincial Directories | Mental Health Directories",
  description:
    "Browse verified mental health services across Canadian provinces. Mental health services — all rated 3 stars or higher.",
  alternates: {
    canonical: "/canada",
  },
  openGraph: {
    title: "Mental Health in Canada | Provincial Directories | Mental Health Directories",
    description:
      "Browse verified mental health services across Canadian provinces. Mental health services.",
    url: "/canada",
    siteName: "MentalHealthDirectories.com",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Canada mental health directory preview",
      },
    ],
  },
};

export default async function CanadaLandingPage() {
  const directory = await getCanadaDirectoryIndex();

  return (
    <div className="bg-background text-foreground">
      <section className="bg-gradient-to-b from-navy via-navy-soft to-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
          <div className="space-y-6 text-surface">
            <p className="inline-flex rounded-full bg-navy-soft/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-gold-soft ring-1 ring-gold-soft/40">
              Canadian Mental Health Directories
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Mental Health in Canada — Province by Province
            </h1>
            <p className="max-w-2xl text-balance text-sm sm:text-base text-surface/80">
              Verified mental health services across Canadian provinces. Every listing rated 3★ or
              higher on Google Maps.
            </p>
          </div>

          <div className="w-full rounded-2xl border-2 border-gold/40 bg-navy-soft/95 p-6 shadow-xl shadow-navy/20 ring-1 ring-gold/30">
            <h2 className="text-xl font-semibold text-white">
              Choose a province
            </h2>
            <p className="mt-2 text-sm text-white/90">
              Browse verified facilities by province, then drill down by city to
              compare care options and contact details.
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {directory.map((item) => item.provinceName).join(" • ")}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {directory.map((item) => (
                <Link
                  key={item.provinceSlug}
                  href={`/canada/${item.provinceSlug}`}
                  className="rounded-xl border-2 border-gold bg-navy px-5 py-4 text-left text-white transition hover:bg-[#21456d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <p className="text-lg font-semibold">{item.provinceName}</p>
                  <p className="mt-1 text-sm text-gold-soft">
                    {item.provinceName} — {item.totalFacilities.toLocaleString()} facilities
                  </p>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-white">
              Each province has its own dedicated directory — specific
              facilities, specific cities, built for that province only.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4" aria-label="Breadcrumb">
          <Link
            href="/"
            className="text-sm font-medium text-teal hover:text-teal-soft hover:underline"
          >
            ← Back to homepage
          </Link>
        </nav>
      </div>
    </div>
  );
}
