import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
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
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ERL5BGRR7D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ERL5BGRR7D');
          `}
        </Script>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8586688641645596"
          strategy="beforeInteractive"
          async
          crossOrigin="anonymous"
        />
      </head>
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
                <nav className="flex items-center gap-4" aria-label="Main navigation">
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
                  <Link
                    href="/contact"
                    className="text-xs font-medium text-white/90 hover:text-gold-soft transition-colors"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/advertise"
                    className="inline-flex items-center justify-center rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                  >
                    Advertise
                  </Link>
                </nav>
              </div>
              <p className="ml-4 hidden max-w-xs text-right text-xs text-gold-soft sm:block">
                Trusted mental health directory for families and professionals.
              </p>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <section
            className="w-full border-t border-navy/10 bg-navy/5"
            aria-label="Full State and City Directory"
          >
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
              <h2 className="text-sm font-semibold text-navy">
                Full State and City Directory
              </h2>
              <p className="mt-1 text-[11px] text-slate-600">
                Crawlable internal links to every state and city page.
              </p>
              <div className="mt-4 flex flex-col gap-5">
                {directory.map((state) => (
                  <div key={state.stateSlug} className="space-y-2">
                    <Link
                      href={`/${state.stateSlug}`}
                      className="text-sm font-semibold text-teal hover:text-teal-soft"
                    >
                      {state.stateName}
                    </Link>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {state.cities.map((city) => (
                        <Link
                          key={`${state.stateSlug}-${city.citySlug}`}
                          href={`/${state.stateSlug}/${city.citySlug}`}
                          className="text-[11px] text-slate-600 hover:text-teal"
                        >
                          {city.cityName}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                {canadaDirectory.length > 0 && (
                  <>
                    <div className="space-y-2 border-t border-navy/10 pt-5">
                      <Link
                        href="/canada"
                        className="text-sm font-semibold text-teal hover:text-teal-soft"
                      >
                        Canada
                      </Link>
                    </div>
                    {canadaDirectory.map((province) => (
                      <div key={province.provinceSlug} className="space-y-2">
                        <Link
                          href={`/canada/${province.provinceSlug}`}
                          className="text-sm font-semibold text-teal hover:text-teal-soft"
                        >
                          {province.provinceName}
                        </Link>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {province.cities.map((city) => (
                            <Link
                              key={`${province.provinceSlug}-${city.citySlug}`}
                              href={`/canada/${province.provinceSlug}/${city.citySlug}`}
                              className="text-[11px] text-slate-600 hover:text-teal"
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
            </div>
          </section>

          <footer className="w-full border-t-[3px] border-gold bg-navy">
            <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/80 sm:px-6 lg:px-8">
              <p>
                © {new Date().getFullYear()} MentalHealthDirectories.com. For
                informational purposes only – always verify licensing and
                accreditation with your local authority.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link href="/privacy" className="hover:text-gold">
                  Privacy
                </Link>
                <Link href="/contact" className="hover:text-gold">
                  Contact
                </Link>
                <Link href="/about" className="hover:text-gold">
                  About
                </Link>
                <Link href="/advertise" className="hover:text-gold">
                  Advertise
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
