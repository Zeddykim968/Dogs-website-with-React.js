"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import type { Puppy } from "@/lib/data/puppies";

interface PuppyCardProps {
  puppy: Puppy;
}

export default function PuppyCard({ puppy }: PuppyCardProps) {
  const isAvailable = puppy.status === "Available";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="group overflow-hidden rounded-3xl border border-[#e8e2da] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <Link href={`/puppies/${puppy.id}`}>
        {/* Image */}
        <div className="relative aspect-[4/4.5] overflow-hidden">
          <img
            src={puppy.image}
            alt={puppy.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Status */}          <div className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isAvailable
                ? "bg-white text-[#4d3827]"
                : "bg-black/70 text-white"
            }`}
          >
            {puppy.status}
          </div>

          {/* Arrow */}
          <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#4d3827] shadow-lg transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#1f2937]">
                {puppy.name}
              </h3>

              <p className="mt-1 text-sm font-medium text-[#8b6f47]">
                {puppy.breed}
              </p>
            </div>

            <p className="whitespace-nowrap text-base font-bold text-[#4d3827]">
              KSh {puppy.price.toLocaleString()}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-[#eee9e2] pt-3.5 text-sm text-[#6b7280]">
            <span>{puppy.gender}</span>

            <span>•</span>

            <span>{puppy.age}</span>

            <span>•</span>

            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {puppy.location}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}