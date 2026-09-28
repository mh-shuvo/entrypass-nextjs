type EventStatus = "DRAFT" | "PUBLISHED" | "ONGOING" | "COMPLETED" | "CANCELLED";

type MockEvent = {
  id: number;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  regStart: Date | null;
  regEnd: Date | null;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  event_slug: string;
};

const mockEvents: MockEvent[] = [
  {
    id: 1,
    title: "Community Open Day",
    description:
      "Explore our latest features, meet the team, and attend guided demos designed for both new and returning users.",
    startDate: new Date("2026-09-30T10:00:00"),
    endDate: new Date("2026-09-30T15:30:00"),
    regStart: new Date("2026-09-01T00:00:00"),
    regEnd: new Date("2026-09-28T23:59:00"),
    status: "PUBLISHED",
    createdAt: new Date("2026-08-18T09:15:00"),
    updatedAt: new Date("2026-09-27T15:00:00"),
    deletedAt: null,
    event_slug: "community-open-day-2026",
  },
  {
    id: 2,
    title: "Spring Product Launch",
    description:
      "A keynote session and product showcase highlighting the biggest updates, innovations, and launches of the season.",
    startDate: new Date("2026-10-18T09:00:00"),
    endDate: new Date("2026-10-18T16:00:00"),
    regStart: new Date("2026-09-20T00:00:00"),
    regEnd: new Date("2026-10-10T23:59:00"),
    status: "PUBLISHED",
    createdAt: new Date("2026-09-15T08:00:00"),
    updatedAt: new Date("2026-09-22T10:30:00"),
    deletedAt: null,
    event_slug: "spring-product-launch-2026",
  },
  {
    id: 3,
    title: "Leadership Summit",
    description:
      "Unpack strategic priorities, leadership challenges, and practical frameworks for building stronger teams.",
    startDate: new Date("2026-11-04T08:30:00"),
    endDate: new Date("2026-11-05T18:00:00"),
    regStart: new Date("2026-09-25T00:00:00"),
    regEnd: new Date("2026-10-28T23:59:00"),
    status: "DRAFT",
    createdAt: new Date("2026-09-10T07:45:00"),
    updatedAt: new Date("2026-09-24T13:15:00"),
    deletedAt: null,
    event_slug: "leadership-summit-2026",
  },
  {
    id: 4,
    title: "Regional Meetup",
    description:
      "Join local partners and community leaders for an evening of networking, discussions, and shared ideas.",
    startDate: new Date("2026-09-25T18:00:00"),
    endDate: new Date("2026-09-25T21:30:00"),
    regStart: new Date("2026-09-03T00:00:00"),
    regEnd: new Date("2026-09-23T23:59:00"),
    status: "CANCELLED",
    createdAt: new Date("2026-08-28T08:45:00"),
    updatedAt: new Date("2026-09-05T15:00:00"),
    deletedAt: null,
    event_slug: "regional-meetup-2026",
  },
];

const statusStyles: Record<EventStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",
  PUBLISHED: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  ONGOING: "bg-blue-100 text-blue-700 ring-blue-200",
  COMPLETED: "bg-violet-100 text-violet-700 ring-violet-200",
  CANCELLED: "bg-rose-100 text-rose-700 ring-rose-200",
};

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

export default function PublicEventsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-600">Upcoming experiences</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900">Events</h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'This month', 'Open registration', 'On-going'].map((tab) => (
                <button
                  key={tab}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    tab === 'All'
                      ? 'border-violet-200 bg-violet-50 text-violet-700'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {mockEvents.map((event) => (
            <article
              key={event.id}
              className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="border-b border-zinc-200 bg-gradient-to-br from-violet-50 via-white to-zinc-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[event.status]}`}>
                    {event.status}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                    {event.event_slug}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-zinc-900">{event.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
                  {event.description || "This event has no description yet."}
                </p>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center gap-3 rounded-2xl bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-violet-600">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 10h18" strokeLinecap="round" />
                  </svg>
                  {formatDate(event.startDate)}
                </div>

                <div className="flex items-center justify-between text-sm text-zinc-600">
                  <span>Starts</span>
                  <span className="font-medium text-zinc-900">{formatTime(event.startDate)}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-zinc-600">
                  <span>Ends</span>
                  <span className="font-medium text-zinc-900">{formatTime(event.endDate)}</span>
                </div>

                <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600">
                  <div className="flex items-center justify-between">
                    <span>Registration</span>
                    <span className="font-medium text-zinc-900">
                      {event.regStart ? formatDate(event.regStart) : "—"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                    <span>Deadline</span>
                    <span>{event.regEnd ? formatDate(event.regEnd) : "—"}</span>
                  </div>
                </div>

                <button className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700">
                  Reserve a spot
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
