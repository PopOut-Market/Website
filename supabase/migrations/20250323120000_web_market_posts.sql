-- Optional starter table for the Next.js Market page.
-- Run in Supabase SQL Editor or via CLI if you use it; adjust to match your existing schema if you already have posts.

create table if not exists public.web_market_posts (
  id uuid primary key default gen_random_uuid(),
  suburb_slug text not null,
  title text not null,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'AUD',
  thumbnail_path text,
  seller_nickname text,
  distance_meters integer,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists web_market_posts_suburb_created_idx
  on public.web_market_posts (suburb_slug, created_at desc);

alter table public.web_market_posts enable row level security;

drop policy if exists "Allow public read market listings" on public.web_market_posts;

create policy "Allow public read market listings"
  on public.web_market_posts
  for select
  using (true);

comment on table public.web_market_posts is 'Public read-only listings for popout website Market grid; suburb_slug matches lib/suburb-slug.ts.';
