"use client";

import { useState } from "react";
import type { Puppy } from "@/lib/data/puppies";

interface PuppyGalleryProps {
  puppy: Puppy;
}

export default function PuppyGallery({
  puppy,
}: PuppyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    puppy.images[0] ?? puppy.image
  );

  return (
    <div>
      <div className="overflow-hidden rounded-3xl bg-[#f3efe8]">
        <img
          src={selectedImage}
          alt={puppy.name}
          className="aspect-square w-full object-cover"
        />
      </div>

      {puppy.images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {puppy.images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`overflow-hidden rounded-2xl border-2 transition ${
                selectedImage === image
                  ? "border-[#6b4f35]"
                  : "border-transparent"
              }`}
            >
              <img
                src={image}
                alt={`${puppy.name} ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}