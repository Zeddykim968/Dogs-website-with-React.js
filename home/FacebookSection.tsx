
"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

const facebookPosts = [
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

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.438H7.078v-3.49h3.047V9.412c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.956.93-1.956 1.884v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  );
}

export default function FacebookSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf1ff] text-[#1877F2]">
                <FacebookIcon size={20} />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1877F2]">
                Join Our Community
              </p>
            </div>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#1f2937] md:text-5xl">
              Life at {SITE_CONFIG.name}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6b7280]">
              Follow us on Facebook for puppy updates, new arrivals,
              behind-the-scenes moments and happy family stories.
            </p>
          </div>

          <a
            href={SITE_CONFIG.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1877F2] px-5 py-3 text-sm font-semibold text-[#1877F2] transition-all hover:bg-[#1877F2] hover:text-white"
          >
            Visit our Facebook
            <ArrowUpRight size={17} />
          </a>
        </div>

        {/* Puppy gallery linking to Facebook */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {facebookPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={SITE_CONFIG.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${post.alt} on our Facebook page`}
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
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                <span className="text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <FacebookIcon size={26} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
