export type PuppyGender = "Male" | "Female";

export type PuppyStatus = "Available" | "Reserved" | "Sold";

export type Puppy = {
  id: string;
  name: string;
  breed: string;
  breedSlug: string;
  gender: PuppyGender;
  age: string;
  ageInMonths: number;
  price: number;
  status: PuppyStatus;
  location: string;
  image: string;
  images: string[];
  description: string;
  temperament: string[];
  vaccinated: boolean;
  dewormed: boolean;
};

export const puppies: Puppy[] = [
  {
    id: "bruno-german-shepherd",
    name: "Bruno",
    breed: "German Shepherd",
    breedSlug: "german-shepherd",
    gender: "Male",
    age: "4 months",
    ageInMonths: 4,
    price: 65000,
    status: "Available",
    location: "Nairobi",
    image:
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Bruno is a confident and playful German Shepherd puppy with a loving personality. He enjoys interacting with people and exploring his surroundings.",
    temperament: ["Playful", "Loyal", "Intelligent"],
    vaccinated: true,
    dewormed: true,
  },

  {
    id: "luna-golden-retriever",
    name: "Luna",
    breed: "Golden Retriever",
    breedSlug: "golden-retriever",
    gender: "Female",
    age: "3 months",
    ageInMonths: 3,
    price: 75000,
    status: "Available",
    location: "Nairobi",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Luna is a gentle and affectionate Golden Retriever who loves attention and playtime. She is an excellent family companion.",
    temperament: ["Friendly", "Gentle", "Affectionate"],
    vaccinated: true,
    dewormed: true,
  },

  {
    id: "max-french-bulldog",
    name: "Max",
    breed: "French Bulldog",
    breedSlug: "french-bulldog",
    gender: "Male",
    age: "3 months",
    ageInMonths: 3,
    price: 90000,
    status: "Available",
    location: "Kiambu",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Max is a charming French Bulldog with a playful personality and lots of character. He loves being around people.",
    temperament: ["Playful", "Calm", "Affectionate"],
    vaccinated: true,
    dewormed: true,
  },

  {
    id: "bella-rottweiler",
    name: "Bella",
    breed: "Rottweiler",
    breedSlug: "rottweiler",
    gender: "Female",
    age: "5 months",
    ageInMonths: 5,
    price: 70000,
    status: "Available",
    location: "Nairobi",
    image:
      "https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Bella is a confident Rottweiler puppy with a calm temperament and strong personality.",
    temperament: ["Confident", "Loyal", "Calm"],
    vaccinated: true,
    dewormed: true,
  },

  {
    id: "cooper-labrador",
    name: "Cooper",
    breed: "Labrador Retriever",
    breedSlug: "labrador-retriever",
    gender: "Male",
    age: "4 months",
    ageInMonths: 4,
    price: 60000,
    status: "Reserved",
    location: "Nairobi",
    image:
      "https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Cooper is an energetic Labrador who loves playing and spending time with people.",
    temperament: ["Energetic", "Friendly", "Playful"],
    vaccinated: true,
    dewormed: true,
  },

  {
    id: "daisy-beagle",
    name: "Daisy",
    breed: "Beagle",
    breedSlug: "beagle",
    gender: "Female",
    age: "4 months",
    ageInMonths: 4,
    price: 55000,
    status: "Available",
    location: "Nakuru",
    image:
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1200&auto=format&fit=crop",
    ],
    description:
      "Daisy is a cheerful Beagle puppy with a curious personality and plenty of energy.",
    temperament: ["Curious", "Cheerful", "Energetic"],
    vaccinated: true,
    dewormed: true,
  },
];