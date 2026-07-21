-- Public leaderboard: top scorers (football) and top bowlers (cricket)
create table if not exists public.leaders (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('scorer', 'bowler')),
  player_name text not null,
  team text not null,
  sport text not null,
  value integer not null,
  unit text not null default 'Goals',
  rank integer not null,
  season text not null default '2025/26',
  created_at timestamptz not null default now()
);

create index if not exists leaders_category_rank_idx
  on public.leaders (category, rank);

alter table public.leaders enable row level security;

-- Anyone can read the leaderboard (anon + authenticated)
create policy "Anyone can read leaders"
  on public.leaders for select
  using (true);

-- Seed sample leaderboard data
insert into public.leaders (category, player_name, team, sport, value, unit, rank, season)
values
  ('scorer', 'Erling Haaland', 'Man City', 'football', 27, 'Goals', 1, '2025/26'),
  ('scorer', 'Mohamed Salah', 'Liverpool', 'football', 24, 'Goals', 2, '2025/26'),
  ('scorer', 'Bukayo Saka', 'Arsenal', 'football', 19, 'Goals', 3, '2025/26'),
  ('scorer', 'Cole Palmer', 'Chelsea', 'football', 18, 'Goals', 4, '2025/26'),
  ('scorer', 'Alexander Isak', 'Newcastle', 'football', 17, 'Goals', 5, '2025/26'),
  ('scorer', 'Ollie Watkins', 'Aston Villa', 'football', 16, 'Goals', 6, '2025/26'),
  ('scorer', 'Son Heung-min', 'Tottenham', 'football', 15, 'Goals', 7, '2025/26'),
  ('scorer', 'Dominic Solanke', 'Tottenham', 'football', 14, 'Goals', 8, '2025/26'),
  ('bowler', 'Jasprit Bumrah', 'India', 'cricket', 42, 'Wickets', 1, '2025'),
  ('bowler', 'Pat Cummins', 'Australia', 'cricket', 38, 'Wickets', 2, '2025'),
  ('bowler', 'Shaheen Afridi', 'Pakistan', 'cricket', 35, 'Wickets', 3, '2025'),
  ('bowler', 'Kagiso Rabada', 'South Africa', 'cricket', 33, 'Wickets', 4, '2025'),
  ('bowler', 'Josh Hazlewood', 'Australia', 'cricket', 31, 'Wickets', 5, '2025'),
  ('bowler', 'Mitchell Starc', 'Australia', 'cricket', 29, 'Wickets', 6, '2025'),
  ('bowler', 'Ravindra Jadeja', 'India', 'cricket', 28, 'Wickets', 7, '2025'),
  ('bowler', 'Trent Boult', 'New Zealand', 'cricket', 26, 'Wickets', 8, '2025');
