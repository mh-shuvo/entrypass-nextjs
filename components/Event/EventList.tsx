"use client";

import { EventListType,StatusFilter,DateFilter,SortOption } from "@/lib/event.types";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {formatDate,formatDateRange,statusStyles} from "@/lib/event.utils";
import PageHeader from "../PageHeader";

const statusOptions: StatusFilter[] = ["ALL", "PUBLISHED", "DRAFT", "ONGOING", "COMPLETED", "CANCELLED"];
interface AdminEventsListComponentProps {
    events: EventListType;
}
export default function AdminEventsListComponent({events}: AdminEventsListComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(events.currentPage || 1);

  const updateDebouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value.trim());
    setCurrentPage(1);
  }, 300);

  useEffect(() => {
    const filters = new URLSearchParams({ page: String(currentPage) });
    if (debouncedSearch) filters.set("q", debouncedSearch);
    if (statusFilter !== "ALL") filters.set("status", statusFilter);
    if (dateFilter !== "ALL") filters.set("date", dateFilter);
    if (dateFilter === "CUSTOM") {
      if (customStartDate) filters.set("startDate", customStartDate);
      if (customEndDate) filters.set("endDate", customEndDate);
    }
    if (sortBy) filters.set("sort", sortBy);

    router.replace(`${pathname}?${filters.toString()}`, { scroll: false });
  }, [
    currentPage,
    customEndDate,
    customStartDate,
    dateFilter,
    debouncedSearch,
    pathname,
    router,
    sortBy,
    statusFilter,
  ]);

  const totalPages = events.totalPages;
  const safePage = Math.min(currentPage, totalPages);

  const handleResetFilters = () => {
    updateDebouncedSearch.cancel();
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("ALL");
    setDateFilter("ALL");
    setCustomStartDate("");
    setCustomEndDate("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader pageName="Events">
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
                const value = event.target.value;
                setSearch(value);
                updateDebouncedSearch(value);
              }}
              className="w-full bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none sm:w-56"
            />
          </label>

          <a href="/dashboard/events/create" className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500">
            + New event
          </a>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total events", value: events.summary.total, tone: "bg-violet-50 text-violet-700" },
          { label: "Published", value: events.summary.published, tone: "bg-emerald-50 text-emerald-700" },
          { label: "Ongoing", value: events.summary.ongoing, tone: "bg-blue-50 text-blue-700" },
          { label: "Drafts", value: events.summary.draft, tone: "bg-slate-100 text-slate-700" },
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
          Showing <strong className="text-zinc-900">{events.data.length * events.currentPage}/{events.totalItems}</strong> results
        </span>
        <span>
          Page <strong className="text-zinc-900">{safePage}</strong> of <strong className="text-zinc-900">{totalPages}</strong>
        </span>
      </div>

      <div className="space-y-4">
        {events.data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-zinc-800">No events match these filters</p>
            <p className="mt-2 text-sm text-zinc-500">Try another status, search term, or reset the filters.</p>
          </div>
        ) : (
          events.data.map((event) => (
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
                      {formatDateRange(event.startDate, event?.endDate)}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-2.5 py-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-zinc-500">
                        <path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      {event.venue ?? "Venue TBD"}
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

      {events.totalPages > 0 && (
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
            {Array.from({ length: events.totalPages }, (_, index) => index + 1).map((page) => (
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
            onClick={() => setCurrentPage((page) => Math.min(page + 1, events.totalPages))}
            disabled={safePage === events.totalPages}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
