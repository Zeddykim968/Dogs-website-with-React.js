"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Nairobi",
    text: "The whole experience felt simple and welcoming. We found a beautiful puppy and the communication throughout the process was excellent.",
  },
  {
    name: "David K.",
    location: "Kiambu",
    text: "I appreciated how much information was provided before making a decision. Our puppy has quickly become part of the family.",
  },
  {
    name: "Grace W.",
    location: "Nakuru",
    text: "Finding our new companion was such an exciting experience. The team was helpful, responsive and easy to communicate with.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#f3efe8] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
            Happy Families
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1f2937] md:text-5xl">
            Loved by families
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#6b7280]">
            Every puppy begins a new story. Here are a few examples of the
            experiences we want every family to have.
          </p>
        </div>

        {/* Testimonials */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="relative rounded-3xl border border-[#e5e1da] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              {/* Quote icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3efe8] text-[#6b4f35]">
                <Quote size={20} />
              </div>

              {/* Stars */}
              <div className="mt-6 flex gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={16}
                    className="fill-[#8b6f47] text-[#8b6f47]"
                  />
                ))}
              </div>

              {/* Testimonial */}
              <p className="mt-5 text-base leading-7 text-[#4b5563]">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Customer */}
              <div className="mt-8 border-t border-[#eee9e2] pt-6">
                <p className="font-semibold text-[#1f2937]">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-sm text-[#8b6f47]">
                  {testimonial.location}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}