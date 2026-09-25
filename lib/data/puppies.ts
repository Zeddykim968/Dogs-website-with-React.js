export type Puppy = {
  id: string;
  name: string;
  breed: string;
  gender: "Male" | "Female";
  age: string;
  price: number;
  image: string;
  location: string;
  status: "Available" | "Reserved" | "Sold";
  featured: boolean;
};

export const puppies: Puppy[] = [
  {
    id: "bruno-001",
    name: "Bruno",
    breed: "German Shepherd",
    gender: "Male",
    age: "12 weeks",
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000&auto=format&fit=crop",
    location: "Nairobi",
    status: "Available",
    featured: true,
  },
  {
    id: "luna-002",
    name: "Luna",
    breed: "Golden Retriever",
    gender: "Female",
    age: "10 weeks",
    price: 55000,
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000&auto=format&fit=crop",
    location: "Nairobi",
    status: "Available",
    featured: true,
  },
  {
    id: "max-003",
    name: "Max",
    breed: "French Bulldog",
    gender: "Male",
    age: "14 weeks",
    price: 75000,
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop",
    location: "Nairobi",
    status: "Available",
    featured: true,
  },
  {
    id: "bella-004",
    name: "Bella",
    breed: "Rottweiler",
    gender: "Female",
    age: "11 weeks",
    price: 60000,
    image:
      "https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000&auto=format&fit=crop",
    location: "Nairobi",
    status: "Reserved",
    featured: true,
  },
];