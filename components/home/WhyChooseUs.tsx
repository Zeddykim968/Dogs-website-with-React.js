"use client";

import {
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Healthy Puppies",
    description:
      "We prioritize the health, wellbeing and proper care of every puppy before they join their new family.",
    icon: Stethoscope,
  },
  {
    title: "Trusted Process",
    description:
      "We keep the puppy-buying process clear and straightforward so you can make your decision with confidence.",
    icon: ShieldCheck,
  },
  {
    title: "Family Support",
    description:
      "Our relationship does not end when you take your puppy home. We are here to help throughout the journey.",
    icon: UsersRound,
  },
  {
    title: "Happy Companions",
    description:
      "We focus on matching families with puppies that can become loving and meaningful lifelong companions.",
    icon: HeartHandshake,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#4d3827] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c2a6]">
            Why Choose Us
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            More than just a puppy
          </h2>

          <p className="mt-5 text-lg leading-8 text-white/70">
            Bringing a puppy home is a big decision. We are here to make the
            experience simple, transparent and focused on finding the right
            companion for your family.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9c2a6] text-[#4d3827]">
                  <Icon size={23} />
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/65">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}