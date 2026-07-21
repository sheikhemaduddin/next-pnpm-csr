-- items table, scoped to the owning user via RLS
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.items enable row level security;

create policy "Users can view their own items"
  on public.items for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own items"
  on public.items for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own items"
  on public.items for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own items"
  on public.items for delete
  to authenticated
  using (auth.uid() = user_id);

-- storage bucket used by app/api/upload/route.js, private by default
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', false)
on conflict (id) do nothing;

-- app/api/upload/route.js stores objects under "<user_id>/<filename>", so the
-- first path segment doubling as the owning user's id is what these policies check
create policy "Users can view their own files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can upload their own files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);
