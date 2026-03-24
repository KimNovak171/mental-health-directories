import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | MentalHealthDirectories.com",
  description:
    "MentalHealthDirectories.com is a free directory helping families and individuals find verified mental health services across the US and Canada.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | MentalHealthDirectories.com",
    description:
      "A free directory helping families and individuals find verified mental health services across the US and Canada.",
    url: "/about",
    siteName: "MentalHealthDirectories.com",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          About us
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          About MentalHealthDirectories.com
        </h1>
      </header>

      <div className="mt-8 space-y-6 text-sm text-slate-700">
        <p className="max-w-2xl leading-relaxed">
          MentalHealthDirectories.com is a <strong>free directory</strong> that
          helps families and individuals find verified mental health services
          across the United States and Canada. We list therapists, clinics,
          counseling centers, and other mental health providers so you can
          compare options by state and city.
        </p>
        <p className="max-w-2xl leading-relaxed">
          Every listing is verified and rated from Google Maps. We focus on
          quality and transparency: you can see ratings, reviews, contact
          details, and website links in one place. Our goal is to make it
          easier to find trusted mental health care near you.
        </p>
        <p className="max-w-2xl leading-relaxed">
          The directory is free to browse. We do not charge visitors. Providers
          can optionally upgrade to Featured or Premium listings to stand out;
          that supports the site and keeps the core directory free for everyone.
        </p>
        <p className="max-w-2xl leading-relaxed">
          If you have questions or suggestions, we&apos;d love to hear from you.
          Contact us at{" "}
          <a
            href="mailto:hello@directoriesnetwork.com"
            className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
          >
            hello@directoriesnetwork.com
          </a>{" "}
          or visit our{" "}
          <Link href="/contact" className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft">
            contact page
          </Link>
          .
        </p>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm text-teal hover:text-teal-soft">
          ← Back to homepage
        </Link>
      </div>
    </main>
  );
}
