"use client";

import { useMemo, useState } from "react";

type EventStatus = "DRAFT" | "PUBLISHED" | "ONGOING" | "COMPLETED" | "CANCELLED";
type StatusFilter = "ALL" | EventStatus;
type DateFilter = "ALL" | "UPCOMING" | "PAST" | "THIS_MONTH" | "NEXT_30_DAYS" | "CUSTOM";
type SortOption = "newest" | "oldest" | "title" | "start-date";

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
    title: "Spring Product Launch",
    description:
      "A showcase event for our latest platform updates, designed for customers, partners, and internal teams.",
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
    id: 2,
    title: "Leadership Summit",
    description:
      "An executive discussion series focused on growth strategy, team planning, and operational excellence.",
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
    id: 3,
    title: "Community Open Day",
    description:
      "A public-facing event with guided demos, networking sessions, and a community Q&A panel.",
    startDate: new Date("2026-09-30T10:00:00"),
    endDate: new Date("2026-09-30T15:30:00"),
    regStart: new Date("2026-09-01T00:00:00"),
    regEnd: new Date("2026-09-28T23:59:00"),
    status: "ONGOING",
    createdAt: new Date("2026-08-18T09:15:00"),
    updatedAt: new Date("2026-09-27T15:00:00"),
    deletedAt: null,
    event_slug: "community-open-day-2026",
  },
  {
    id: 4,
    title: "Quarterly Training Week",
    description:
      "Hands-on workshops and training sessions for onboarding, product adoption, and service excellence.",
    startDate: new Date("2026-08-12T09:00:00"),
    endDate: new Date("2026-08-16T17:00:00"),
    regStart: new Date("2026-07-01T00:00:00"),
    regEnd: new Date("2026-08-05T23:59:00"),
    status: "COMPLETED",
    createdAt: new Date("2026-06-30T08:30:00"),
    updatedAt: new Date("2026-08-18T11:20:00"),
    deletedAt: null,
    event_slug: "quarterly-training-week-2026",
  },
  {
    id: 5,
    title: "Investor Briefing",
    description:
      "A private briefing session covering milestones, financial highlights, and strategic priorities.",
    startDate: new Date("2026-12-10T13:00:00"),
    endDate: new Date("2026-12-10T15:00:00"),
    regStart: new Date("2026-10-02T00:00:00"),
    regEnd: new Date("2026-12-01T23:59:00"),
    status: "DRAFT",
    createdAt: new Date("2026-09-18T12:00:00"),
    updatedAt: new Date("2026-09-26T09:05:00"),
    deletedAt: null,
    event_slug: "investor-briefing-2026",
  },
  {
    id: 6,
    title: "Regional Meetup",
    description:
      "A networking event for community leaders, local partners, and attendees interested in regional updates.",
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
  {
    id: 7,
    title: "Customer Advisory Forum",
    description:
      "A stakeholder session focused on usage feedback, roadmap planning, and partner collaboration.",
    startDate: new Date("2026-10-09T09:00:00"),
    endDate: new Date("2026-10-09T13:00:00"),
    regStart: new Date("2026-09-15T00:00:00"),
    regEnd: new Date("2026-10-04T23:59:00"),
    status: "PUBLISHED",
    createdAt: new Date("2026-09-02T10:00:00"),
    updatedAt: new Date("2026-09-18T11:00:00"),
    deletedAt: null,
    event_slug: "customer-advisory-forum-2026",
  },
  {
    id: 8,
    title: "Operations Review Lab",
    description:
      "A working session where cross-functional teams review performance, blockers, and operational playbooks.",
    startDate: new Date("2026-11-18T10:30:00"),
    endDate: new Date("2026-11-18T15:00:00"),
    regStart: new Date("2026-10-01T00:00:00"),
    regEnd: new Date("2026-11-10T23:59:00"),
    status: "DRAFT",
    createdAt: new Date("2026-08-22T14:00:00"),
    updatedAt: new Date("2026-09-14T09:30:00"),
    deletedAt: null,
    event_slug: "operations-review-lab-2026",
  },
  {
    id: 9,
    title: "Startup Roundtable",
    description:
      "A curated networking and learning event for founders, operators, and innovation partners.",
    startDate: new Date("2026-10-25T18:00:00"),
    endDate: new Date("2026-10-25T20:30:00"),
    regStart: new Date("2026-09-28T00:00:00"),
    regEnd: new Date("2026-10-17T23:59:00"),
    status: "PUBLISHED",
    createdAt: new Date("2026-09-03T08:05:00"),
    updatedAt: new Date("2026-09-19T14:25:00"),
    deletedAt: null,
    event_slug: "startup-roundtable-2026",
  },
  {
    id: 10,
    title: "Partner Enablement Session",
    description:
      "A practical event for partners to learn workflows, tools, and sales enablement resources.",
    startDate: new Date("2026-07-08T11:00:00"),
    endDate: new Date("2026-07-08T15:00:00"),
    regStart: new Date("2026-06-01T00:00:00"),
    regEnd: new Date("2026-07-05T23:59:00"),
    status: "COMPLETED",
    createdAt: new Date("2026-05-25T08:10:00"),
    updatedAt: new Date("2026-07-10T10:00:00"),
    deletedAt: null,
    event_slug: "partner-enablement-session-2026",
  },
  {
    id: 11,
    title: "Field Team Sprint",
    description:
      "A rapid planning session for field teams covering campaign priorities, playbooks, and execution check-ins.",
    startDate: new Date("2026-10-30T09:00:00"),
    endDate: new Date("2026-10-30T17:00:00"),
    regStart: new Date("2026-09-29T00:00:00"),
    regEnd: new Date("2026-10-22T23:59:00"),
    status: "ONGOING",
    createdAt: new Date("2026-08-27T08:40:00"),
    updatedAt: new Date("2026-09-20T09:00:00"),
    deletedAt: null,
    event_slug: "field-team-sprint-2026",
  },
  {
    id: 12,
    title: "Mid-Year Strategy Review",
    description:
      "A leadership review covering progress against goals, operational risks, and action plans for the next cycle.",
    startDate: new Date("2026-06-12T12:30:00"),
    endDate: new Date("2026-06-12T16:30:00"),
    regStart: new Date("2026-05-10T00:00:00"),
    regEnd: new Date("2026-06-08T23:59:00"),
    status: "COMPLETED",
    createdAt: new Date("2026-05-05T07:00:00"),
    updatedAt: new Date("2026-06-15T17:15:00"),
    deletedAt: null,
    event_slug: "mid-year-strategy-review-2026",
  },
  {
    id: 13,
    title: "Customer Success Day",
    description:
      "A high-energy event bringing together account teams, customers, and support leads to share best practices.",
    startDate: new Date("2026-12-02T10:00:00"),
    endDate: new Date("2026-12-02T16:00:00"),
    regStart: new Date("2026-10-15T00:00:00"),
    regEnd: new Date("2026-11-25T23:59:00"),
    status: "PUBLISHED",
    createdAt: new Date("2026-09-11T09:00:00"),
    updatedAt: new Date("2026-09-23T12:40:00"),
    deletedAt: null,
    event_slug: "customer-success-day-2026",
  },
  {
    id: 14,
    title: "Board Briefing Session",
    description:
      "An internal briefing session for leadership stakeholders focused on milestones, trends, and next steps.",
    startDate: new Date("2026-09-18T15:00:00"),
    endDate: new Date("2026-09-18T17:00:00"),
    regStart: new Date("2026-08-15T00:00:00"),
    regEnd: new Date("2026-09-14T23:59:00"),
    status: "CANCELLED",
    createdAt: new Date("2026-08-09T11:00:00"),
    updatedAt: new Date("2026-09-17T12:00:00"),
    deletedAt: null,
    event_slug: "board-briefing-session-2026",
  },
  {
    id: 15,
    title: "Innovation Workshop",
    description:
      "An interactive workshop for teams to prototype concepts, map opportunities, and align on execution.",
    startDate: new Date("2026-10-12T09:30:00"),
    endDate: new Date("2026-10-12T14:00:00"),
    regStart: new Date("2026-09-05T00:00:00"),
    regEnd: new Date("2026-10-08T23:59:00"),
    status: "DRAFT",
    createdAt: new Date("2026-09-01T07:15:00"),
    updatedAt: new Date("2026-09-24T08:30:00"),
    deletedAt: null,
    event_slug: "innovation-workshop-2026",
  },
];

const statusStyles: Record<EventStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",
  PUBLISHED: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  ONGOING: "bg-blue-100 text-blue-700 ring-blue-200",
  COMPLETED: "bg-violet-100 text-violet-700 ring-violet-200",
  CANCELLED: "bg-rose-100 text-rose-700 ring-rose-200",
};

const formatDate = (date: Date | null | undefined, options?: Intl.DateTimeFormatOptions) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(date);
};

const formatDateRange = (startDate: Date, endDate: Date) => {
  const sameDay = startDate.toDateString() === endDate.toDateString();

  if (sameDay) {
    return formatDate(startDate, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return `${formatDate(startDate, {
    month: "short",
    day: "numeric",
  })} - ${formatDate(endDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const statusOptions: StatusFilter[] = ["ALL", "PUBLISHED", "DRAFT", "ONGOING", "COMPLETED", "CANCELLED"];
const pageSize = 4;

export default function AdminEventsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const result = mockEvents.filter((event) => {
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.event_slug.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;

      const matchesDate = (() => {
        if (dateFilter === "ALL") return true;

        if (dateFilter === "UPCOMING") return event.startDate >= now;
        if (dateFilter === "PAST") return event.endDate < now;
        if (dateFilter === "THIS_MONTH") return event.startDate >= startOfMonth && event.startDate <= endOfMonth;
        if (dateFilter === "NEXT_30_DAYS") return event.startDate >= now && event.startDate <= next30Days;

        if (dateFilter === "CUSTOM") {
          const start = customStartDate ? new Date(`${customStartDate}T00:00:00`) : null;
          const end = customEndDate ? new Date(`${customEndDate}T23:59:59`) : null;

          if (start && end && start > end) return false;
          if (start && end) return event.startDate >= start && event.endDate <= end;
          if (start) return event.startDate >= start;
          if (end) return event.endDate <= end;
          return true;
        }

        return true;
      })();

      return matchesSearch && matchesStatus && matchesDate;
    });

    result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "oldest") return a.createdAt.getTime() - b.createdAt.getTime();
      if (sortBy === "start-date") return a.startDate.getTime() - b.startDate.getTime();
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return result;
  }, [search, statusFilter, dateFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedEvents = filteredEvents.slice((safePage - 1) * pageSize, safePage * pageSize);

  const publishedCount = mockEvents.filter((event) => event.status === "PUBLISHED").length;
  const ongoingCount = mockEvents.filter((event) => event.status === "ONGOING").length;
  const draftCount = mockEvents.filter((event) => event.status === "DRAFT").length;

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDateFilter("ALL");
    setCustomStartDate("");
    setCustomEndDate("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
            Event management
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">Events</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-zinc-400">
              <circle cx="11" cy="11" r="6" />
              <path d="M20 20L16.65 16.65" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search events"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none sm:w-56"
            />
          </label>

          <button className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500">
            + New event
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total events", value: mockEvents.length, tone: "bg-violet-50 text-violet-700" },
          { label: "Published", value: publishedCount, tone: "bg-emerald-50 text-emerald-700" },
          { label: "Ongoing", value: ongoingCount, tone: "bg-blue-50 text-blue-700" },
          { label: "Drafts", value: draftCount, tone: "bg-slate-100 text-slate-700" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${stat.tone}`}>
              {stat.label}
            </div>
            <p className="mt-4 text-3xl font-bold text-zinc-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setStatusFilter(filter);
                  setCurrentPage(1);
                }}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  statusFilter === filter
                    ? "border-violet-200 bg-violet-50 text-violet-700"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                }`}
              >
                {filter === "ALL" ? "All statuses" : filter}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={dateFilter}
                onChange={(event) => {
                  setDateFilter(event.target.value as DateFilter);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none"
              >
                <option value="ALL">All dates</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="PAST">Past</option>
                <option value="THIS_MONTH">This month</option>
                <option value="NEXT_30_DAYS">Next 30 days</option>
                <option value="CUSTOM">Custom range</option>
              </select>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title</option>
                <option value="start-date">Start date</option>
              </select>

              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
              >
                Reset
              </button>
            </div>

            {dateFilter === "CUSTOM" && (
              <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 sm:flex-row">
                <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
                  Start date
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(event) => {
                      setCustomStartDate(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-sm text-zinc-700 outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
                  End date
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(event) => {
                      setCustomEndDate(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-sm text-zinc-700 outline-none"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm">
        <span>
          Showing <strong className="text-zinc-900">{filteredEvents.length}</strong> results
        </span>
        <span>
          Page <strong className="text-zinc-900">{safePage}</strong> of <strong className="text-zinc-900">{totalPages}</strong>
        </span>
      </div>

      <div className="space-y-4">
        {paginatedEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-zinc-800">No events match these filters</p>
            <p className="mt-2 text-sm text-zinc-500">Try another status, search term, or reset the filters.</p>
          </div>
        ) : (
          paginatedEvents.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[event.status]}`}>
                      {event.status}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                      {event.event_slug}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900">{event.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                      {event.description || "No description provided for this event."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-zinc-600">
                    <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-2.5 py-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-zinc-500">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M16 3v4M8 3v4M3 10h18" strokeLinecap="round" />
                      </svg>
                      {formatDateRange(event.startDate, event.endDate)}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-2.5 py-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-zinc-500">
                        <circle cx="12" cy="12" r="8" />
                        <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Reg. {event.regStart ? formatDate(event.regStart) : "—"} - {event.regEnd ? formatDate(event.regEnd) : "—"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-2 sm:flex-row lg:flex-col xl:flex-row">
                  <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50">
                    View details
                  </button>
                  <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700">
                    Edit event
                  </button>
                </div>
              </div>

              <div className="border-t border-zinc-200 bg-zinc-50/80 px-5 py-3 text-xs text-zinc-500">
                Created {formatDate(event.createdAt)} • Updated {formatDate(event.updatedAt)}
              </div>
            </article>
          ))
        )}
      </div>

      {filteredEvents.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={safePage === 1}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-9 min-w-9 rounded-xl border px-2.5 text-sm font-medium ${
                  page === safePage
                    ? "border-violet-200 bg-violet-50 text-violet-700"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            disabled={safePage === totalPages}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
