import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";

import ContactForm from "@/components/contact/ContactForm";
import { SITE_CONFIG } from "@/lib/constants";


type ChannelIcon = ComponentType<{ size?: number }>;

function FacebookIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.438H7.078v-3.49h3.047V9.412c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.956.93-1.956 1.884v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Puppy Paradise on WhatsApp or email — ask about available puppies, schedule a visit or get support after your puppy arrives home.",
};

const channels: Array<{
  title: string;
  description: string;
  href: string | null;
  value: string;
  icon: ChannelIcon;
}> = [
  {
    title: "WhatsApp",
    description: "Fastest way to reach us about availability and visits.",
    href: `https://wa.me/${254797088972}?text=Hello%20Puppy%20Paradise!`,
    value: `+${254797088972}`,
    icon: MessageCircle,
  },
  {
    title: "Email",
    description: "For questions, feedback and everything in between.",
    href: `mailto:${SITE_CONFIG.email}`,
    value: SITE_CONFIG.email,
    icon: Mail,
  },
  {
    title: "Facebook",
    description: "Puppy updates, new arrivals and happy family stories.",
    href: SITE_CONFIG.facebookUrl,
    value: "@puppyparadise",
    icon: FacebookIcon,
  },
  {
    title: "Location",
    description: "Nairobi, Kenya — visits by appointment.",
    href: null,
    value: "Nairobi, Kenya",
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <section className="bg-[#4d3827] px-6 pb-12 pt-24 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c2a6]">
            We&rsquo;re Here To Help
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Contact us
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Have a question about a puppy, want to schedule a visit or need
            support after your puppy arrives home? We are always happy to
            hear from you.
          </p>
        </div>
      </section>

      {/* Channels + form */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Channels */}
          <div className="space-y-4">
            {channels.map((channel) => {
              const Icon = channel.icon;

              const body = (
                <>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f3efe8] text-[#6b4f35]">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-[#1f2937]">
                      {channel.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[#6b7280]">
                      {channel.description}
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold text-[#6b4f35]">
                      {channel.value}
                    </p>
                  </div>
                </>
              );

              const cardClass =
                "flex gap-4 rounded-3xl border border-[#e8e2da] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg";

              return channel.href ? (
                <a
                  key={channel.title}
                  href={channel.href}
                  target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {body}
                </a>
              ) : (
                <div key={channel.title} className={cardClass}>
                  {body}
                </div>
              );
            })}

            <div className="rounded-3xl border border-[#e8e2da] bg-[#f3efe8] p-6">
              <h2 className="font-bold text-[#1f2937]">Opening hours</h2>

              <div className="mt-3 space-y-2 text-sm text-[#6b7280]">
                <div className="flex justify-between gap-4">
                  <span>Monday &ndash; Saturday</span>
                  <span className="font-medium text-[#4b5563]">
                    8:00 &ndash; 18:00
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Sunday</span>
                  <span className="font-medium text-[#4b5563]">
                    By appointment
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
