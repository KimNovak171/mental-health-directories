import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { getCanadaDirectoryIndex } from "@/lib/canadaFacilities";
import { getDirectoryIndex } from "@/lib/stateFacilities";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mentalhealthdirectories.com"),
  title: {
    default: "MentalHealthDirectories.com | Mental Health Directory",
    template: "%s | MentalHealthDirectories.com",
  },
  description:
    "MentalHealthDirectories.com is a professional, easy-to-use mental health directory helping families and professionals find mental health services, therapists, and treatment options across the United States and Canada.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MentalHealthDirectories.com | Mental Health Directory",
    description:
      "Trusted resource to explore and compare mental health services, therapists, and treatment options across North America.",
    url: "/",
    siteName: "MentalHealthDirectories.com",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "MentalHealthDirectories.com logo preview",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [directory, canadaDirectory] = await Promise.all([
    getDirectoryIndex(),
    getCanadaDirectoryIndex(),
  ]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <header className="w-full border-b-[3px] border-gold bg-navy text-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-[11px] font-bold tracking-[0.28em] sm:text-xs text-white hover:text-gold-soft transition-colors"
                  aria-label="MentalHealthDirectories.com – go to homepage"
                >
                  MENTALHEALTHDIRECTORIES.COM
                </Link>
                <nav className="flex items-center gap-4" aria-label="Country sections">
                  <Link
                    href="/"
                    className="text-xs font-medium text-white/90 hover:text-gold-soft transition-colors"
                  >
                    USA
                  </Link>
                  <Link
                    href="/canada"
                    className="text-xs font-medium text-white/90 hover:text-gold-soft transition-colors"
                  >
                    Canada
                  </Link>
                </nav>
              </div>
              <p className="ml-4 hidden max-w-xs text-right text-xs text-gold-soft sm:block">
                Trusted mental health directory for families and professionals.
              </p>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="w-full border-t-[3px] border-gold bg-navy">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-xs text-white/80 sm:px-6 lg:px-8">
              <p>
                © {new Date().getFullYear()} MentalHealthDirectories.com. For
                informational purposes only – always verify licensing and
                accreditation with your local authority.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="hover:text-gold">
                  About this directory
                </a>
                <Link href="/advertise" className="hover:text-gold">
                  Advertise
                </Link>
                <Link href="/advertise" className="hover:text-gold">
                  For Care Providers
                </Link>
                <Link href="/advertise" className="hover:text-gold">
                  Featured Listing
                </Link>
                <a href="#" className="hover:text-gold">
                  Privacy &amp; terms
                </a>
              </div>

              <section className="border-t border-white/15 pt-4">
                <h2 className="text-sm font-semibold text-gold-soft">
                  Full State and City Directory
                </h2>
                <p className="mt-1 text-[11px] text-white/70">
                  Crawlable internal links to every state and city page.
                </p>
                <div className="mt-3 flex flex-col gap-5">
                  {directory.map((state) => (
                    <div key={state.stateSlug} className="space-y-2">
                      <Link
                        href={`/${state.stateSlug}`}
                        className="text-sm font-semibold text-gold-soft hover:text-gold"
                      >
                        {state.stateName}
                      </Link>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {state.cities.map((city) => (
                          <Link
                            key={`${state.stateSlug}-${city.citySlug}`}
                            href={`/${state.stateSlug}/${city.citySlug}`}
                            className="text-[11px] text-white/85 hover:text-gold"
                          >
                            {city.cityName}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  {canadaDirectory.length > 0 && (
                    <>
                      <div className="space-y-2 border-t border-white/15 pt-5">
                        <Link
                          href="/canada"
                          className="text-sm font-semibold text-gold-soft hover:text-gold"
                        >
                          Canada
                        </Link>
                      </div>
                      {canadaDirectory.map((province) => (
                        <div key={province.provinceSlug} className="space-y-2">
                          <Link
                            href={`/canada/${province.provinceSlug}`}
                            className="text-sm font-semibold text-gold-soft hover:text-gold"
                          >
                            {province.provinceName}
                          </Link>
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {province.cities.map((city) => (
                              <Link
                                key={`${province.provinceSlug}-${city.citySlug}`}
                                href={`/canada/${province.provinceSlug}/${city.citySlug}`}
                                className="text-[11px] text-white/85 hover:text-gold"
                              >
                                {city.cityName}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </section>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
