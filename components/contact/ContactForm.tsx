"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Mail,
  MessageCircle,
  RotateCcw,
  Send,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const interestOptions = [
  "General enquiry",
  "Puppy availability",
  "Schedule a visit",
  "Booking & payment",
  "After-care support",
];

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(interestOptions[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const fieldClass =
    "w-full rounded-2xl border border-[#e5dfd7] bg-[#faf9f6] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#8b6f47]";

  const labelClass = "mb-2 block text-sm font-medium text-[#1f2937]";

  const errorClass = "mt-2 block text-sm text-[#b91c1c]";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (message.trim().length < 10) {
      nextErrors.message =
        "Please tell us a little more (at least 10 characters).";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const text = encodeURIComponent(
      `Hello ${SITE_CONFIG.name}!\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nInterested in: ${interest}\n\n${message.trim()}`,
    );

    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${text}`;

    setSentUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleReset() {
    setName("");
    setEmail("");
    setInterest(interestOptions[0]);
    setMessage("");
    setErrors({});
    setSentUrl(null);
  }

  if (sentUrl) {
    return (
      <div className="rounded-3xl border border-[#e8e2da] bg-white p-8 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f1e7] text-[#42613d]">
          <CheckCircle2 size={26} />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-[#1f2937]">
          Your message is ready
        </h2>

        <p className="mt-3 leading-7 text-[#6b7280]">
          We opened WhatsApp with your message — press send in the chat to
          reach us. We usually reply within a few hours.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href={sentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6b4f35] px-6 py-3.5 font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg"
          >
            <MessageCircle size={18} />
            Open WhatsApp Again
          </a>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9c2a6] px-6 py-3.5 font-semibold text-[#4d3827] transition-all hover:bg-[#f3efe8]"
          >
            <RotateCcw size={17} />
            Write Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#e8e2da] bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-bold text-[#1f2937]">Send us a message</h2>

      <p className="mt-2 text-sm leading-6 text-[#6b7280]">
        Fill in the form and we will open a WhatsApp chat with your message
        ready to send.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Your name
            </label>

            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Doe"
              className={fieldClass}
            />

            {errors.name && <span className={errorClass}>{errors.name}</span>}
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email address
            </label>

            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jane@example.com"
              className={fieldClass}
            />

            {errors.email && (
              <span className={errorClass}>{errors.email}</span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="contact-interest" className={labelClass}>
            What can we help with?
          </label>

          <select
            id="contact-interest"
            value={interest}
            onChange={(event) => setInterest(event.target.value)}
            className={fieldClass}
          >
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            Your message
          </label>

          <textarea
            id="contact-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            placeholder="Tell us which puppy you are interested in, or ask us anything..."
            className={`${fieldClass} resize-y`}
          />

          {errors.message && (
            <span className={errorClass}>{errors.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6b4f35] px-6 py-3.5 font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-lg"
        >
          <Send size={18} />
          Send via WhatsApp
        </button>

        <p className="text-center text-sm text-[#6b7280]">
          Prefer email?{" "}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="inline-flex items-center gap-1 font-semibold text-[#6b4f35] hover:underline"
          >
            <Mail size={14} />
            {SITE_CONFIG.email}
          </a>
        </p>
      </form>
    </div>
  );
}
