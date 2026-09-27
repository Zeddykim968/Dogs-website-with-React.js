"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

export default function FinalCTA() {
  return (
    <section className="bg-[#faf9f6] px-6 py-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#4d3827]"
      >
        <div className="relative px-8 py-16 text-center md:px-16 md:py-20 lg:px-24">
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d9c2a6] text-[#4d3827]">
              <Heart size={25} />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#d9c2a6]">
              Your New Best Friend Awaits
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Ready to find your perfect companion?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Explore our available puppies or talk with us directly. We are
              here to help you find a companion that feels right for your
              family.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/puppies"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-[#4d3827] transition-all hover:bg-[#f3efe8] hover:shadow-xl"
              >
                Explore Puppies
                <ArrowRight size={18} />
              </Link>

              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition-all hover:border-white hover:bg-white/10"
              >
                <MessageCircle size={18} />
                Chat With Us
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}