-- Run this once in the Supabase SQL editor for your project.

-- Profiles table: extends Supabase's built-in auth.users
create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  role text not null check (role in ('entrepreneur', 'investor')),
  created_at timestamp default now()
);

-- Ideas posted by entrepreneurs
create table ideas (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) not null,
  title text not null,
  body text,
  category text not null,
  ask numeric not null,
  raised numeric not null default 0,
  created_at timestamp default now()
);

-- Pledges made by investors
create table pledges (
  id uuid default gen_random_uuid() primary key,
  idea_id uuid references ideas(id) not null,
  investor_id uuid references profiles(id) not null,
  amount numeric not null,
  created_at timestamp default now()
);

-- Automatically create a profile row whenever someone signs up.
-- Expects "name" and "role" to be passed in as auth signUp options.data
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Automatically bump an idea's "raised" total whenever a pledge is inserted
create function public.update_idea_raised()
returns trigger as $$
begin
  update public.ideas set raised = raised + new.amount where id = new.idea_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_pledge_insert
after insert on pledges
for each row execute function public.update_idea_raised();

-- Row Level Security: lock tables down, then open specific policies
alter table profiles enable row level security;
alter table ideas enable row level security;
alter table pledges enable row level security;

create policy "profiles are viewable by everyone" on profiles
  for select using (true);
create policy "users can update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "ideas are viewable by everyone" on ideas
  for select using (true);
create policy "entrepreneurs can insert their own ideas" on ideas
  for insert with check (auth.uid() = author_id);

create policy "pledges are viewable by everyone" on pledges
  for select using (true);
create policy "investors can insert their own pledges" on pledges
  for insert with check (auth.uid() = investor_id);
