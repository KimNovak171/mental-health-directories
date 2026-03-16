import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | MentalHealthDirectories.com",
  description:
    "Get in touch with MentalHealthDirectories.com. Send a message or email support@mentalhealthdirectories.com.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | MentalHealthDirectories.com",
    description: "Contact MentalHealthDirectories.com. We're here to help.",
    url: "/contact",
    siteName: "MentalHealthDirectories.com",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Get in touch
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          Contact us
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Have a question or feedback? Use the form below or email us directly
          at{" "}
          <a
            href="mailto:support@mentalhealthdirectories.com"
            className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
          >
            support@mentalhealthdirectories.com
          </a>
          .
        </p>
      </header>

      <section className="mt-8 rounded-2xl border-2 border-teal/20 bg-surface p-6 shadow-sm sm:p-8">
        <p className="mb-5 text-sm text-slate-600">
          Send us a message and we&apos;ll get back to you as soon as we can.
        </p>
        <ContactForm />
      </section>

      <p className="mt-6 text-sm text-slate-600">
        You can also reach us at{" "}
        <a
          href="mailto:support@mentalhealthdirectories.com"
          className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
        >
          support@mentalhealthdirectories.com
        </a>
        .
      </p>

      <div className="mt-8">
        <Link href="/" className="text-sm text-teal hover:text-teal-soft">
          ← Back to homepage
        </Link>
      </div>
    </main>
  );
}
