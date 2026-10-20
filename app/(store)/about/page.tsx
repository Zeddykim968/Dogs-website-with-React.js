import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import FinalCTA from "@/home/FinalCTA";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Puppy Paradise — who we are, how we care for our puppies and how we help families find the right companion.",
};

const values = [
  {
    title: "Health Before Anything",
    description:
      "Every puppy is raised with proper veterinary care, vaccinations and deworming before they are ready to meet their new family.",
    icon: Stethoscope,
  },
  {
    title: "Honest Guidance",
    description:
      "We share clear information about temperament, care and costs so you can make a decision you feel good about.",
    icon: ShieldCheck,
  },
  {
    title: "Responsible Practices",
    description:
      "We raise our puppies in healthy environments and only list companions we would be proud to send home with our own families.",
    icon: UsersRound,
  },
  {
    title: "Support After Home",
    description:
      "Our relationship begins when your puppy arrives. We stay available for advice, questions and support along the way.",
    icon: HeartHandshake,
  },
];

const stats = [
  {
    value: "100+",
    label: "Happy families",
  },
  {
    value: "6",
    label: "Popular breeds",
  },
  {
    value: "100%",
    label: "Vaccinated & dewormed",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <section className="bg-[#4d3827] px-6 pb-16 pt-32 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c2a6]">
            Who We Are
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
            About {SITE_CONFIG.name}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            We help families across Kenya find healthy, happy puppies and
            support them long after their new companion arrives home.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[2rem] bg-[#e9e2d9] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop"
              alt="Golden retriever puppy with its family"
              className="h-[420px] w-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
              Our Story
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1f2937] md:text-5xl">
              A simpler, kinder way to find a puppy
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-[#6b7280]">
              <p>
                {SITE_CONFIG.name} began with a simple idea: finding a new
                companion should feel exciting, never stressful. Too many
                families struggle to find healthy puppies with honest
                information and clear answers, so we built a place where the
                process is transparent from the very first message.
              </p>

              <p>
                Today we connect families with beautiful puppies across
                Nairobi, Kiambu, Nakuru and beyond. Every listing includes the
                details that matter — age, temperament, health status and
                location — so you know exactly what to expect before you make
                contact.
              </p>

              <p>
                We stay involved after your puppy settles in, because a good
                match is only the beginning of a long and happy story.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/puppies"
                className="inline-flex items-center gap-2 rounded-full bg-[#6b4f35] px-6 py-3.5 font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-xl"
              >
                Meet Our Puppies
                <ArrowRight size={18} />
              </Link>

              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#d9c2a6] px-6 py-3.5 font-semibold text-[#4d3827] transition-all hover:bg-[#f3efe8]"
              >
                <MessageCircle size={18} />
                Talk With Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
              What We Believe
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1f2937] md:text-5xl">
              The standards we hold ourselves to
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#6b7280]">
              Bringing a puppy into your home is a big decision. These are the
              promises behind every puppy we list and every conversation we
              have.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-3xl border border-[#e5e1da] bg-[#faf9f6] p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3efe8] text-[#6b4f35]">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#1f2937]">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#6b7280]">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#faf9f6] px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#4d3827] px-8 py-14 md:px-16">
          <div className="grid gap-10 text-center sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-5xl font-bold text-white">{stat.value}</p>

                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c2a6]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
