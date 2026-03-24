"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("MentalHealthDirectories.com contact");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:hello@directoriesnetwork.com?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-navy"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-surface-muted bg-surface px-4 py-2.5 text-navy shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          placeholder="Your name"
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-navy"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-surface-muted bg-surface px-4 py-2.5 text-navy shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-navy"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="mt-1 block w-full rounded-lg border border-surface-muted bg-surface px-4 py-2.5 text-navy shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          placeholder="Your message..."
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-teal px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
      >
        Send message
      </button>
    </form>
  );
}
