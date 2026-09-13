# IdeaFeed

A small app that lets entrepreneurs post ideas that need funding, and lets investors browse and pledge to them. Built with React + Vite, styled with Tailwind, and backed by Supabase (auth + database + realtime).

## 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your project, open the **SQL Editor**, paste in the contents of `supabase/schema.sql`, and run it. This creates the `profiles`, `ideas`, and `pledges` tables, sets up triggers (so a profile is created automatically on signup, and an idea's `raised` total updates automatically when a pledge comes in), and turns on Row Level Security.
3. In **Settings → API**, copy your **Project URL** and **anon public key**.

## 2. Configure the app

```bash
cp .env.example .env
```

Open `.env` and paste in your Project URL and anon key:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Install and run

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`) in your browser.

## 4. Try it out

- Sign up once as an **entrepreneur** (post an idea) and once as an **investor** (fund ideas) — use two different emails, or two browser windows (one in incognito), since you can only be logged into one account at a time.
- As the entrepreneur, post an idea with a name, pitch, category, and funding ask.
- As the investor, browse the feed, filter by category, and pledge an amount to an idea. Because this uses Supabase realtime, if you have both accounts open in two windows, you'll see the entrepreneur's feed update live when the investor pledges.

## Notes on what's still missing

This gets you a real, working app with real accounts and a real database — but it does **not** move real money. Pledges are just numbers in a database. Turning this into something that handles actual payments (and the securities-law questions that come with matching investors to businesses) is a separate, much bigger step — worth talking to a lawyer before going further in that direction.

If your Supabase project has **email confirmation** turned on by default (Authentication → Providers → Email), you'll need to confirm the signup email before the account can log in. You can turn this off in your project's auth settings while you're testing locally.
