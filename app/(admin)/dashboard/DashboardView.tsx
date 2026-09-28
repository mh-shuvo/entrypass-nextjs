"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const overviewCards = [
  { label: "Total events", value: "24", change: "+4 this month", tone: "violet" },
  { label: "Registrations", value: "1,284", change: "+18.2%", tone: "emerald" },
  { label: "Check-ins", value: "842", change: "+96 today", tone: "sky" },
  { label: "Avg. attendance", value: "68%", change: "+5.4%", tone: "amber" },
];

const upcomingEvents = [
  { title: "Product Launch Night", date: "Tue, 14 Oct", venue: "Sky Hall", attendees: 420, status: "Published" },
  { title: "Leadership Summit", date: "Thu, 16 Oct", venue: "Grand Center", attendees: 310, status: "Draft" },
  { title: "Community Meetup", date: "Sat, 18 Oct", venue: "Harbor Studio", attendees: 185, status: "Ongoing" },
];

const activityFeed = [
  { title: "New registration received", subtitle: "for Product Launch Night", time: "12 min ago" },
  { title: "Venue confirmation updated", subtitle: "Leadership Summit", time: "1 hr ago" },
  { title: "Check-in kiosk synced", subtitle: "Community Meetup", time: "3 hrs ago" },
  { title: "Security review passed", subtitle: "All event forms validated", time: "Today" },
];

const tasks = [
  { title: "Finalize speaker lineup", priority: "High" },
  { title: "Confirm catering for Summit", priority: "Medium" },
  { title: "Review waitlist approvals", priority: "Low" },
];

const channelData = [
  { label: "Website", value: 48 },
  { label: "Social", value: 33 },
  { label: "Email", value: 19 },
];

export default function DashboardView() {
  const { data: session } = useSession();
  const permissions = ((session?.user as { permissions?: string[] } | undefined)?.permissions ?? []);
  const displayName = session?.user?.name ?? session?.user?.email ?? "Admin";

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 p-6 text-white shadow-lg shadow-violet-200 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-100">Operations overview</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Welcome back, {displayName}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-violet-50">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <Link
              href="/dashboard/events"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              New event
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-violet-100">{card.label}</p>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-50">
                  {card.change}
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight">{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Planning</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Upcoming events</h2>
            </div>
            <Link href="/dashboard/events" className="text-sm font-semibold text-violet-600 hover:text-violet-700">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{event.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{event.date} • {event.venue}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Attendees</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{event.attendees}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      event.status === "Published"
                        ? "bg-emerald-100 text-emerald-700"
                        : event.status === "Ongoing"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Acquisition</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Traffic source</h2>

          <div className="mt-6 space-y-4">
            {channelData.map((channel) => (
              <div key={channel.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                  <span>{channel.label}</span>
                  <span>{channel.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${channel.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Top performing event</p>
            <p className="mt-2 text-xl font-bold text-slate-900">Product Launch Night</p>
            <p className="mt-1 text-sm text-emerald-600">92% conversion rate</p>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live activity</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Recent activity</h2>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {activityFeed.map((item, index) => (
              <div key={item.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-500" />
                  {index !== activityFeed.length - 1 ? <span className="mt-2 h-full w-px bg-slate-200" /> : null}
                </div>

                <div className="flex-1 pb-3">
                  <p className="font-medium text-slate-800">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Operations</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Priority tasks</h2>

          <div className="mt-5 space-y-3">
            {tasks.map((task) => (
              <div key={task.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="font-medium text-slate-800">{task.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{task.priority}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    task.priority === "High"
                      ? "bg-rose-100 text-rose-700"
                      : task.priority === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">Access</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {permissions.length > 0 ? (
                permissions.map((permission) => (
                  <span key={permission} className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-xs font-medium text-violet-700">
                    {permission}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">No permission set</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
