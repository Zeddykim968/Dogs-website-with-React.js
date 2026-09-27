"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

const instagramPosts = [
  {
    id: "post-1",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=900&auto=format&fit=crop",
    alt: "Golden retriever puppy",
  },
  {
    id: "post-2",
    image:
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=900&auto=format&fit=crop",
    alt: "German Shepherd puppy",
  },
  {
    id: "post-3",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=900&auto=format&fit=crop",
    alt: "French Bulldog",
  },
  {
    id: "post-4",
    image:
      "https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=900&auto=format&fit=crop",
    alt: "Rottweiler",
  },
  {
    id: "post-5",
    image:
      "https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?q=80&w=900&auto=format&fit=crop",
    alt: "Labrador Retriever",
  },
  {
    id: "post-6",
    image:
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=900&auto=format&fit=crop",
    alt: "Beagle",
  },
];

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

export default function InstagramSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3efe8] text-[#6b4f35]">
                <InstagramIcon size={20} />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
                Follow Our Journey
              </p>
            </div>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#1f2937] md:text-5xl">
              Life at {SITE_CONFIG.name}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6b7280]">
              Follow us on Instagram for puppy updates, new arrivals,
              behind-the-scenes moments and happy family stories.
            </p>
          </div>

          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9c2a6] px-5 py-3 text-sm font-semibold text-[#4d3827] transition-all hover:bg-[#6b4f35] hover:text-white"
          >
            Follow us
            <ArrowUpRight size={17} />
          </a>
        </div>

        {/* Instagram grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <img
                src={post.image}
                alt={post.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                <InstagramIcon
                  size={26}
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}