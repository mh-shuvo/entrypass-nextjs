import type { Event } from "@prisma/client";
import { extractTime, formatDate } from "@/lib/event.utils";
export default function EventCard({ event }: { event: Event }) {
    return (
        <article
            className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
            {/* Visual Header Banner */}
            <div className="relative h-44 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-800 p-5 text-white flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-black/35 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                        {event.status}
                    </span>
                </div>

                <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                        {event.venue}
                    </div>
                </div>
            </div>

            {/* Card Main Info */}
            <div className="flex flex-1 flex-col p-6">

                {/* Date & Time Pill */}
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <svg className="h-4 w-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{formatDate(event.startDate)}</span>
                    <span>•</span>
                    <span>{extractTime(event.startDate)}</span>
                </div>

                {/* Title & Description */}
                <h2 className="mt-3 text-xl font-bold text-zinc-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 transition-colors">
                    {event.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {event.description}
                </p>

                {/* Spacer to push bottom section down */}
                <div className="mt-auto pt-6">

                    {/* Bottom CTA Button */}
                    <div className="mt-5 flex items-center gap-3">
                        <button
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-violet-700 active:scale-95"
                        >
                            <span>Reserve Spot</span>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>

                </div>

            </div>
        </article>
    )
}