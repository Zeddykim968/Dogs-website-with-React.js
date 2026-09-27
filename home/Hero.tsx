"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
        
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#8b6f47]">
            Find Your New Best Friend
          </p>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-[#1f2937] md:text-6xl">
            A loving companion is waiting for you.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#6b7280]">
            Discover beautiful, healthy and happy puppies ready to become
            part of your family.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/puppies"
              className="inline-flex items-center gap-2 rounded-full bg-[#6b4f35] px-6 py-3.5 font-semibold text-white transition-all hover:bg-[#4d3827] hover:shadow-xl"
            >
              Explore Puppies
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/about"
              className="rounded-full border border-[#d9c2a6] px-6 py-3.5 font-semibold text-[#4d3827] transition-all hover:bg-[#f3efe8]"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[2rem] bg-[#e9e2d9] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop"
              alt="Golden retriever puppy"
              className="h-[520px] w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-sm font-medium text-[#6b7280]">
              Happy families
            </p>
            <p className="mt-1 text-2xl font-bold text-[#4d3827]">
              100+
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}