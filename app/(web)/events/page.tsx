import ReservationForm from "@/components/Event/ReservationForm";
import EventCards from "./EventCards";
import { EventService } from "@/services/event.service";
import { EventRepository } from "@/repository/event.repository";
import { EVENT_STATUS } from "@prisma/client";
const eventService = new EventService(new EventRepository())

export default async function EventsPage({ searchParams }: { searchParams: { page?: number } }) {
  const { page } = searchParams
  const events = await eventService.getAllEvents({
    page: page ? Number(page) : 1,
    status: EVENT_STATUS.PUBLISHED
  })
  return (
    <div className="min-h-screen bg-zinc-50/60 pb-24 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

      {/* ========================================================================= */}
      {/* 1. HEADER & SEARCH HERO */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <span className="h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
              Verified Event Registry
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Explore Events & Experience Passes
            </h1>
            <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
              Find technical conferences, summits, and hands-on workshops. Book your 1-click verified QR pass with no account needed.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN EVENT LISTINGS */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <EventCards events={events} />
      </main>
      <ReservationForm />
    </div>
  );
}
