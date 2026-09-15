# Events & Bookings Manager — Final Plan

A learning project to get hands-on with the full Next.js stack used by the real
`flight-plan` project, using a simple, self-contained domain instead of aviation.
Goal: touch every tool/package the real project uses, in context, so the
takeover feels familiar rather than new.

**Stack:** Next.js 16.2 (App Router) · React 19.2 · TypeScript · Turbopack ·
Prisma 7 + MariaDB (`@prisma/adapter-mariadb`) · NextAuth v4 + bcryptjs ·
Zod v4 + react-hook-form · SWR · shadcn/ui (Radix + Tailwind v4 + CVA) ·
next-themes · sonner · react-day-picker + date-fns · Google Maps ·
@react-pdf/renderer · exceljs · csv-parse · @upstash/ratelimit + redis ·
@marsidev/react-turnstile · nodemailer · recharts · nanoid · dotenv + tsx.

---

## 1. Non-technical requirements

**Users**
- **Super Admin** — organizing-committee member with full system access.
- **Executive** — organizing-committee member with specific, assigned permissions.
- **Guest** — a visitor booking a spot; no account needed.

**Requirements**
1. Committee members (Super Admin / Executive) can log in securely.
2. Login is protected against bots and repeated automated attempts.
3. Access is permission-based: a Super Admin has full access; an Executive only
   has the specific permissions assigned to them (e.g. manage events, but not
   manage other users).
4. Users with the right permission can create, edit, and delete events — title,
   description, date, venue address.
5. Users can see a list of events, filterable by date range.
6. Each event page shows the venue location on a map.
7. Each event has a public page (shareable link) where a guest can book a spot
   with just their name and email — no account required.
8. The public booking form is protected against bots and spam.
9. After booking, the guest sees a confirmation with a unique booking reference,
   and also receives it by email.
10. Users with the right permission can view the attendee list for an event.
11. Users can bulk-add attendees by uploading a spreadsheet/CSV file.
12. Guests and organizers can download a PDF ticket with event details and
    booking reference.
13. Users with the right permission can export the attendee list to Excel.
14. A dashboard shows a simple chart of bookings over time.
15. The app supports light and dark display modes.
16. Demo data (a Super Admin, an Executive, a few events, sample attendees)
    is seeded automatically for testing.

---

## 2. Database schema (5 tables)

```
users                          permissions
──────────────────             ──────────────────
id            PK               id            PK
name                           name (unique)     e.g. "manage_events",
email (unique)                                    "manage_users",
passwordHash                                      "export_attendees",
type          ENUM             description        "view_dashboard"
  (SUPER_ADMIN | EXECUTIVE)
createdAt

user_permissions (join table)          events
──────────────────                     ──────────────────
userId        FK -> users.id           id            PK
permissionId  FK -> permissions.id     title
(composite PK: userId+permissionId)    description
                                        eventDate
                                        venueAddress
                                        venueLat / venueLng
                                        createdById   FK -> users.id
                                        createdAt

bookings
──────────────────
id                PK
eventId           FK -> events.id
guestName
guestEmail
bookingReference   (unique, via nanoid)
createdAt
```

**Authorization rule:**
`SUPER_ADMIN` → always allowed, no permission lookup needed.
`EXECUTIVE` → allowed only if `user_permissions` has a row for
`(userId, requiredPermissionId)`.

**Scope note:** permissions above are **global** (an Executive with
`manage_events` can manage *all* events). If later you want per-event scoping
(Executive A can manage Event X but not Event Y), add an `eventId` column to
`user_permissions` — a straightforward extension, not a redesign.

---

## 3. High-level system architecture

```
                          ┌─────────────────────────┐
                          │        Browser           │
                          │  (Organizer UI / Public  │
                          │   booking page)           │
                          └────────────┬─────────────┘
                                       │ HTTPS
                                       ▼
                          ┌─────────────────────────┐
                          │   proxy.ts (coarse gate)  │
                          │  redirect if no session   │
                          └────────────┬─────────────┘
                                       ▼
                    ┌──────────────────────────────────┐
                    │        Next.js App Router          │
                    │                                     │
                    │  app/(dashboard)/...   → RSC pages  │
                    │  app/(public)/events/[id]/book       │
                    │  app/api/... → Route Handlers        │
                    │    - auth/[...nextauth]               │
                    │    - bookings (POST, rate-limited)    │
                    │    - events/[id]/ticket (PDF stream)  │
                    │    - events/[id]/attendees/export     │
                    └───────┬───────────────┬──────────────┘
                            │               │
              ┌─────────────┘               └─────────────┐
              ▼                                            ▼
  ┌───────────────────────┐                  ┌─────────────────────────┐
  │   lib/auth/dal.ts       │                  │   features/*/actions.ts  │
  │  requireUser()           │                  │   'use server' mutations │
  │  requirePermission(name)  │◄────────────────┤   (create/edit event,    │
  │  getServerSession() cached│                  │    import CSV, etc.)     │
  └───────────┬───────────────┘                  └────────────┬────────────┘
              │                                                │
              ▼                                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │                    features/*/queries.ts (DAL)                    │
  │      every read/write passes through here + authorization check   │
  └───────────────────────────────┬────────────────────────────────┘
                                   ▼
                     ┌───────────────────────────┐
                     │   lib/db.ts (Prisma 7)      │
                     │  singleton + MariaDB adapter │
                     └───────────────┬─────────────┘
                                     ▼
                          ┌─────────────────────┐
                          │   MariaDB              │
                          │  users / permissions /  │
                          │  user_permissions /     │
                          │  events / bookings       │
                          └─────────────────────┘

  Side services used by specific features:
  ┌───────────────┐ ┌────────────────┐ ┌──────────────┐ ┌───────────────┐
  │ Upstash Redis   │ │ Turnstile (CF)   │ │ nodemailer     │ │ Google Maps API │
  │ rate-limit login│ │ bot-check login/ │ │ booking confirm│ │ venue map        │
  │ + booking POST  │ │ booking forms    │ │ email          │ │                  │
  └───────────────┘ └────────────────┘ └──────────────┘ └───────────────┘

  File generation (in-process, streamed via Route Handlers):
  ┌────────────────────────┐        ┌──────────────────────┐
  │ @react-pdf/renderer      │        │ exceljs / csv-parse    │
  │ → PDF ticket               │        │ → Excel export,         │
  │                             │        │   CSV bulk-import        │
  └────────────────────────┘        └──────────────────────┘
```

**Key architectural decisions**
- **`proxy.ts` is a coarse gate only** (session exists / doesn't) — never does
  permission checks. Real enforcement is in the Data Access Layer.
- **DAL is the single enforcement point.** Every query/mutation — whether
  called from a Server Component, a Server Action, or a Route Handler — goes
  through `requireUser()` / `requirePermission()` before touching Prisma.
- **Public booking path has no session** — it's guarded instead by Turnstile
  (bot-check) and Upstash rate-limiting, since anyone can hit it.
- **Server Components (RSC)** handle authenticated, permission-gated reads
  (event list, attendee list, dashboard).
- **Route Handlers** exist for: NextAuth's own endpoint, anything a client
  needs to re-fetch via SWR, and anything that streams binary output (PDF,
  Excel) rather than returning JSON.
- **DTOs** — queries return plain objects shaped for the UI, never raw Prisma
  rows, so no internal fields (password hash, etc.) can leak to the client.

---

## 4. Incremental build order (unchanged approach, mapped to this domain)

| # | Feature | Packages added | Tables touched |
|---|---------|----------------|-----------------|
| 0 | Scaffold | create-next-app | — |
| 1 | UI shell, theme toggle, toasts | shadcn, next-themes, sonner | — |
| 2 | First persisted model | prisma, adapter-mariadb, dotenv, tsx | users |
| 3 | Event create/edit form | react-hook-form, hookform/resolvers, zod | events |
| 4 | Event list + live filter | swr | events |
| 5 | Date fields + range filter | react-day-picker, date-fns | events |
| 6 | Login (Super Admin / Executive) | next-auth@4, bcryptjs | users |
| 7 | Permission system wired into DAL | — (schema only) | permissions, user_permissions |
| 8 | Login hardening | turnstile, upstash/ratelimit, upstash/redis | — |
| 9 | Public booking form + reference | nanoid | bookings |
| 10 | Booking confirmation email | nodemailer | bookings |
| 11 | Attendee list + CSV bulk import | csv-parse | bookings |
| 12 | PDF ticket download | @react-pdf/renderer | bookings, events |
| 13 | Attendee Excel export | exceljs | bookings |
| 14 | Dashboard chart | recharts | bookings |
| 15 | Venue map | @types/google.maps | events |
| 16 | Seed script (demo data) | (uses tsx/dotenv already added) | all |

Same rule as before: install a package only at the step that needs it; decide
the DAL/permission boundary early (step 7) since it's the one piece every
later step depends on.