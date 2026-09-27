"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Breed } from "@/lib/data/breeds";

interface BreedCardProps {
  breed: Breed;
}

export default function BreedCard({ breed }: BreedCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-3xl bg-[#e9e2d9] shadow-sm"
    >
      <Link href={`/breeds/${breed.slug}`} className="block">
        <div className="relative h-[420px] overflow-hidden">
          <img
            src={breed.image}
            alt={breed.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-medium text-white/75">
                  {breed.puppyCount} puppies available
                </p>

                <h3 className="text-2xl font-bold">
                  {breed.name}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                  {breed.description}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#4d3827] shadow-lg transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}