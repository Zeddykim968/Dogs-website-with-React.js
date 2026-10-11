"use client";

import { MessageCircle } from "lucide-react";
import type { Puppy } from "@/lib/data/puppies";
import { SITE_CONFIG } from "@/lib/constants";

interface PuppyContactProps {
  puppy: Puppy;
}

export default function PuppyContact({
  puppy,
}: PuppyContactProps) {
  const message = encodeURIComponent(
    `Hello, I'm interested in ${puppy.name}, the ${puppy.breed} puppy listed on your website. Is ${puppy.name} still available?`
  );

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`;

  return (
    <div className="mt-10 rounded-3xl bg-[#4d3827] p-6 text-white">
      <h2 className="text-xl font-bold">
        Interested in {puppy.name}?
      </h2>

      <p className="mt-2 text-sm leading-6 text-white/70">
        Contact us directly on WhatsApp to confirm availability and
        discuss the next steps.
      </p>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[#4d3827] transition hover:bg-[#f3efe8]"
      >
        <MessageCircle size={19} />
        Ask About {puppy.name}
      </a>
    </div>
  );
}