import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | MentalHealthDirectories.com",
  description:
    "Privacy policy for MentalHealthDirectories.com. How we collect, use, and protect your information.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | MentalHealthDirectories.com",
    description: "Privacy policy for MentalHealthDirectories.com.",
    url: "/privacy",
    siteName: "MentalHealthDirectories.com",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Legal
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-600">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>
      </header>

      <div className="prose prose-navy mt-8 max-w-none space-y-6 text-sm text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-navy">1. Introduction</h2>
          <p>
            MentalHealthDirectories.com (&quot;we,&quot; &quot;our,&quot; or
            &quot;the site&quot;) is a free directory website helping families
            and individuals find verified mental health services across the
            United States and Canada. This Privacy Policy explains how we
            collect, use, and protect your information when you use our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">
            2. Information we collect
          </h2>
          <p>
            We may collect information you provide directly, such as when you
            contact us (name, email, message), subscribe to updates, or submit an
            inquiry. We also collect information automatically when you visit
            our site, including your IP address, browser type, device type,
            pages visited, and referring URL. We may use cookies and similar
            technologies to improve your experience and for analytics.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">
            3. How we use your information
          </h2>
          <p>
            We use the information we collect to operate and improve the
            directory, respond to your inquiries, send relevant updates (if you
            have opted in), analyze site usage, and comply with legal
            obligations. We do not sell your personal information to third
            parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">
            4. Third-party services
          </h2>
          <p>
            Our site may use third-party services such as analytics (e.g.,
            Google Analytics), advertising (e.g., Google AdSense), and
            payment processors for featured or premium listings. These services
            have their own privacy policies governing how they use data. We
            encourage you to review their policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">5. Data security</h2>
          <p>
            We take reasonable steps to protect your information from
            unauthorized access, loss, or misuse. However, no transmission over
            the internet or electronic storage is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">6. Your choices</h2>
          <p>
            You may opt out of certain cookies through your browser settings. You
            may unsubscribe from communications at any time. You may request
            access to or deletion of your personal information by contacting us
            at hello@directoriesnetwork.com.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">7. Children</h2>
          <p>
            Our site is not directed at children under 13. We do not knowingly
            collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">8. Changes</h2>
          <p>
            We may update this Privacy Policy from time to time. The &quot;Last
            updated&quot; date at the top will reflect the most recent version.
            Continued use of the site after changes constitutes acceptance of
            the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">9. Contact</h2>
          <p>
            For questions about this Privacy Policy or our practices, contact us
            at{" "}
            <a
              href="mailto:hello@directoriesnetwork.com"
              className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
            >
              hello@directoriesnetwork.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm text-teal hover:text-teal-soft">
          ← Back to homepage
        </Link>
      </div>
    </main>
  );
}
