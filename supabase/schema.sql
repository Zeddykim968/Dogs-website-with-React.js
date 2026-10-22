-- Puppy Paradise — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is idempotent: re-running it will not overwrite rows you have edited
-- (seed inserts use ON CONFLICT DO NOTHING).

-- ============================================================
-- Tables
-- ============================================================

create table if not exists public.breeds (
  id          text primary key,          -- slug, e.g. 'labrador-retriever'
  name        text not null,
  description text not null default '',
  image       text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.puppies (
  id            text primary key,        -- slug, e.g. 'cooper-labrador'
  name          text not null,
  breed         text not null,
  breed_slug    text not null,
  gender        text not null check (gender in ('Male', 'Female')),
  age           text not null,
  age_in_months integer not null default 0,
  price         integer not null default 0,
  status        text not null default 'Available'
                check (status in ('Available', 'Reserved', 'Sold')),
  featured      boolean not null default false,
  location      text not null default '',
  image         text not null default '',
  images        text[] not null default '{}',
  description   text not null default '',
  temperament   text[] not null default '{}',
  vaccinated    boolean not null default false,
  dewormed      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- One row per registered admin account (auth.users holds credentials).
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Small key/value settings (currently: the registration invite-code hash).
create table if not exists public.site_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.breeds        enable row level security;
alter table public.puppies       enable row level security;
alter table public.profiles      enable row level security;
alter table public.site_settings enable row level security;

-- Public site can read the catalogue.
create policy "public read breeds"
  on public.breeds for select
  using (true);

create policy "public read puppies"
  on public.puppies for select
  using (true);

-- Admins read and update their own profile only.
create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- No policies for writes on breeds/puppies/site_settings:
-- all mutations go through server routes using the service-role key.

-- ============================================================
-- Storage: public photo bucket (writes happen via service role)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('puppy-photos', 'puppy-photos', true)
on conflict (id) do nothing;

create policy "public read photos"
  on storage.objects for select
  using (bucket_id = 'puppy-photos');

-- ============================================================
-- Seed data (matches the site's current content)
-- ============================================================

insert into public.breeds (id, name, description, image, created_at) values
  ('german-shepherd', 'German Shepherd',
   'Loyal, intelligent and protective companions for active families.',
   'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1200&auto=format&fit=crop',
   now()),
  ('golden-retriever', 'Golden Retriever',
   'Friendly, affectionate and playful dogs known for their gentle nature.',
   'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop',
   now() - interval '5 minutes'),
  ('french-bulldog', 'French Bulldog',
   'Charming, adaptable and affectionate companions with a playful personality.',
   'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop',
   now() - interval '10 minutes'),
  ('rottweiler', 'Rottweiler',
   'Confident, loyal and powerful companions with strong family bonds.',
   'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1200&auto=format&fit=crop',
   now() - interval '15 minutes'),
  ('labrador-retriever', 'Labrador Retriever',
   'Energetic, intelligent and affectionate dogs that love being around people.',
   'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?q=80&w=1200&auto=format&fit=crop',
   now() - interval '20 minutes'),
  ('beagle', 'Beagle',
   'Curious, cheerful and energetic companions with a friendly temperament.',
   'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1200&auto=format&fit=crop',
   now() - interval '25 minutes')
on conflict (id) do nothing;

insert into public.puppies
  (id, name, breed, breed_slug, gender, age, age_in_months, price, status,
   featured, location, image, images, description, temperament, vaccinated,
   dewormed, created_at)
values
  ('bruno-german-shepherd', 'Bruno', 'German Shepherd', 'german-shepherd',
   'Male', '4 months', 4, 65000, 'Available', true, 'Nairobi',
   'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1200&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1200&auto=format&fit=crop',
         'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=1200&auto=format&fit=crop',
         'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop'],
   'Bruno is a confident and playful German Shepherd puppy with a loving personality. He enjoys interacting with people and exploring his surroundings.',
   array['Playful', 'Loyal', 'Intelligent'], true, true,
   now()),

  ('luna-golden-retriever', 'Luna', 'Golden Retriever', 'golden-retriever',
   'Female', '3 months', 3, 75000, 'Available', true, 'Nairobi',
   'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop',
         'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=1200&auto=format&fit=crop',
         'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=1200&auto=format&fit=crop'],
   'Luna is a gentle and affectionate Golden Retriever who loves attention and playtime. She is an excellent family companion.',
   array['Friendly', 'Gentle', 'Affectionate'], true, true,
   now() - interval '5 minutes'),

  ('max-french-bulldog', 'Max', 'French Bulldog', 'french-bulldog',
   'Male', '3 months', 3, 90000, 'Available', true, 'Kiambu',
   'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop',
         'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop'],
   'Max is a charming French Bulldog with a playful personality and lots of character. He loves being around people.',
   array['Playful', 'Calm', 'Affectionate'], true, true,
   now() - interval '10 minutes'),

  ('bella-rottweiler', 'Bella', 'Rottweiler', 'rottweiler',
   'Female', '5 months', 5, 70000, 'Available', true, 'Nairobi',
   'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1200&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1200&auto=format&fit=crop',
         'https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=1200&auto=format&fit=crop'],
   'Bella is a confident Rottweiler puppy with a calm temperament and strong personality.',
   array['Confident', 'Loyal', 'Calm'], true, true,
   now() - interval '15 minutes'),

  ('cooper-labrador', 'Cooper', 'Labrador Retriever', 'labrador-retriever',
   'Male', '4 months', 4, 60000, 'Reserved', false, 'Nairobi',
   'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?q=80&w=1200&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?q=80&w=1200&auto=format&fit=crop'],
   'Cooper is an energetic Labrador who loves playing and spending time with people.',
   array['Energetic', 'Friendly', 'Playful'], true, true,
   now() - interval '20 minutes'),

  ('daisy-beagle', 'Daisy', 'Beagle', 'beagle',
   'Female', '4 months', 4, 55000, 'Available', false, 'Nakuru',
   'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1200&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1200&auto=format&fit=crop'],
   'Daisy is a cheerful Beagle puppy with a curious personality and plenty of energy.',
   array['Curious', 'Cheerful', 'Energetic'], true, true,
   now() - interval '25 minutes')
on conflict (id) do nothing;
