# cozy-anonymous-circles

Cozy Circles — small, interest-driven groups that exist to get people offline.
A group has 28 days to organise a real meetup. If it doesn't, the group quietly
disappears.

## The idea

Most community apps optimise for staying in the app. This one is built to
expire. You join a group anonymously, talk to the other members, and plan
something in person — and the deadline is the whole mechanic. No likes, no
follower counts, no feed to scroll forever.

## What's in it

- **Anonymous membership** — you're in the group before you're identifiable.
- **Interest tags** — chosen during onboarding, or imported from your Reddit
  subscriptions if you connect Reddit. Karma comes across as a trust badge.
- **Location-aware groups** — filtered by where you actually are, with venue
  search via Google Places.
- **Meetups** — plan, RSVP, see them on a Mapbox map, and write a recap after.
- **Messaging** — group posts plus direct conversations.
- **The 28-day warning** — groups approaching the deadline are flagged, and
  expired ones are swept.
- **Group admin** — invitations, member management, moderation actions.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui (Radix) ·
TanStack Query · React Router · Mapbox GL · Supabase (auth, Postgres, edge
functions)

Edge functions cover Reddit sync, Google Places lookup, Unsplash group images,
invitation email, and the group-warning sweep.

## Running locally

```sh
npm install
npm run dev
```

Needs a Supabase project (migrations are in `supabase/migrations`) plus Mapbox,
Google Places, and Unsplash keys for the corresponding features.

## Layout

| Path | Role |
|---|---|
| `src/pages/` | Landing, auth, dashboard, groups, feed, messages, profile |
| `src/components/meetup/` | Planning, RSVPs, map, recaps, notifications |
| `src/components/messaging/` | Conversations and chat |
| `src/components/group-detail/` | Group page, members, posts |
| `src/hooks/` | Feed, groups, location, profile, invitations, notifications |
| `supabase/functions/` | Reddit sync, Places, Unsplash, invites, warnings |
| `supabase/migrations/` | Schema and row-level security |

## License

Copyright © 2026 Mohit Shukla. All rights reserved.

This repository is made publicly viewable for portfolio and demonstration
purposes only. No license is granted to use, copy, modify, merge, publish,
distribute, sublicense, or sell copies of cozy-anonymous-circles or any part of
it, in whole or in part, without prior written permission from the
copyright holder.
