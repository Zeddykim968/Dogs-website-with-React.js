"use client";

import {
  Search,
  Heart,
  MessageCircle,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Explore Puppies",
    description:
      "Browse our available puppies and explore different breeds, ages, personalities and prices.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose Your Companion",
    description:
      "Take your time to find the puppy that feels like the right match for you and your family.",
    icon: Heart,
  },
  {
    number: "03",
    title: "Talk With Us",
    description:
      "Contact us through WhatsApp to ask questions, confirm availability and discuss the next steps.",
    icon: MessageCircle,
  },
  {
    number: "04",
    title: "Welcome Them Home",
    description:
      "Complete the arrangements and get ready to welcome your new companion into your home.",
    icon: Home,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
            Simple & Straightforward
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1f2937] md:text-4xl">
            How it works
          </h2>

          <p className="mt-4 text-base leading-7 text-[#6b7280]">
            Finding your new companion should feel exciting, not complicated.
            We make the process simple from your first search to the moment
            you bring your puppy home.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12">
          {/* Connecting line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-[#e5e1da] lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="relative text-center"
                >
                  {/* Icon */}
                  <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#f3efe8] text-[#6b4f35] shadow-sm">
                    <Icon size={22} />
                  </div>

                  {/* Number */}
                  <p className="mt-5 text-xs font-bold tracking-[0.2em] text-[#a18a6d]">
                    STEP {step.number}
                  </p>

                  {/* Title */}
                  <h3 className="mt-2 text-lg font-bold text-[#1f2937]">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}