"use client";

import { useState } from "react";
import Link from "next/link";

interface FeaturedEvent {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: string;
  spotsLeft: number;
  totalSpots: number;
  status: "REGISTRATION OPEN" | "FEW SPOTS LEFT" | "FEATURED";
  gradient: string;
}

const featuredEvents: FeaturedEvent[] = [
  {
    id: 1,
    slug: "ai-developer-summit-2026",
    title: "AI Developer Summit 2026",
    category: "Artificial Intelligence",
    date: "Oct 10, 2026",
    time: "09:00 AM - 06:00 PM",
    venue: "Grand Center",
    city: "Chicago, IL",
    price: "Free Access",
    spotsLeft: 34,
    totalSpots: 500,
    status: "FEW SPOTS LEFT",
    gradient: "from-violet-600 via-indigo-600 to-purple-800",
  },
  {
    id: 2,
    slug: "nextjs-fullstack-bootcamp",
    title: "Next.js Full Stack Bootcamp",
    category: "Web Development",
    date: "Nov 05, 2026",
    time: "08:30 AM - 06:00 PM",
    venue: "Harbor Studio",
    city: "Seattle, WA",
    price: "Free Access",
    spotsLeft: 85,
    totalSpots: 300,
    status: "REGISTRATION OPEN",
    gradient: "from-blue-600 via-indigo-600 to-cyan-600",
  },
  {
    id: 3,
    slug: "cyber-security-awareness-day",
    title: "Cyber Security Awareness Day",
    category: "Security & Privacy",
    date: "Nov 20, 2026",
    time: "10:00 AM - 04:00 PM",
    venue: "Summit Room",
    city: "Austin, TX",
    price: "Free Access",
    spotsLeft: 120,
    totalSpots: 400,
    status: "FEATURED",
    gradient: "from-emerald-600 via-teal-600 to-cyan-700",
  },
  {
    id: 4,
    slug: "zero-trust-security-summit",
    title: "Zero Trust Security Summit",
    category: "Cloud Security",
    date: "Dec 02, 2026",
    time: "09:00 AM - 05:00 PM",
    venue: "Cedar Conference Hall",
    city: "Boston, MA",
    price: "Free Access",
    spotsLeft: 42,
    totalSpots: 250,
    status: "FEW SPOTS LEFT",
    gradient: "from-amber-600 via-orange-600 to-rose-700",
  },
  {
    id: 5,
    slug: "annual-tech-fest-2026",
    title: "Annual Tech Fest 2026",
    category: "Innovation & Startups",
    date: "Dec 12, 2026",
    time: "09:00 AM - 08:00 PM",
    venue: "Riverfront Venue",
    city: "Miami, FL",
    price: "Free Access",
    spotsLeft: 210,
    totalSpots: 800,
    status: "REGISTRATION OPEN",
    gradient: "from-fuchsia-600 via-pink-600 to-rose-600",
  },
  {
    id: 6,
    slug: "devops-platform-engineering-summit",
    title: "DevOps & Platform Engineering",
    category: "Infrastructure",
    date: "Jan 18, 2027",
    time: "09:00 AM - 05:00 PM",
    venue: "Union Convention Center",
    city: "San Diego, CA",
    price: "Free Access",
    spotsLeft: 96,
    totalSpots: 350,
    status: "REGISTRATION OPEN",
    gradient: "from-sky-600 via-blue-600 to-indigo-800",
  },
];

const categories = [
  { name: "All Topics", count: "48 Events", icon: "⚡" },
  { name: "Artificial Intelligence", count: "12 Events", icon: "🤖" },
  { name: "Cloud & Security", count: "14 Events", icon: "🛡️" },
  { name: "Web & Fullstack", count: "10 Events", icon: "🌐" },
  { name: "DevOps & SRE", count: "8 Events", icon: "🚀" },
  { name: "Leadership & Product", count: "4 Events", icon: "💡" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [demoAttendeeName, setDemoAttendeeName] = useState("Alex Rivera");
  const [demoPassType, setDemoPassType] = useState<"VIP" | "EXECUTIVE" | "GENERAL">("VIP");

  const filteredEvents =
    activeCategory === "All Topics"
      ? featuredEvents
      : featuredEvents.filter(
          (e) =>
            e.category.toLowerCase().includes(activeCategory.toLowerCase().slice(0, 4)) ||
            activeCategory.toLowerCase().includes(e.category.toLowerCase().slice(0, 4))
        );

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient decorative glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-600/15 via-indigo-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-[40rem] -left-40 -z-10 h-[500px] w-[600px] rounded-full bg-gradient-to-br from-fuchsia-600/10 via-purple-500/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-[90rem] -right-40 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative px-4 pt-12 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3.5 py-1.5 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur-sm dark:border-violet-800/50 dark:bg-violet-950/60 dark:text-violet-300">
                <span className="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
                <span>Next-Gen Event Access & Ticketing</span>
                <span className="text-violet-400">•</span>
                <span className="font-normal text-violet-600 dark:text-violet-400">2026 Season</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl sm:leading-[1.12] dark:text-white">
                Access World-Class Events with{" "}
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Instant Digital Passes
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-xl">
                Discover premier tech conferences, leadership summits, and masterclasses. Reserve tickets in seconds with verified cryptographic QR passes — zero friction, zero scalping.
              </p>

              {/* Search & Action bar */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/events"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-violet-500/35 active:scale-95"
                >
                  <span>Explore Upcoming Events</span>
                  <svg
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white/80 px-6 py-4 text-base font-semibold text-zinc-800 shadow-sm backdrop-blur-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-800 active:scale-95"
                >
                  <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  <span>Organizer Console</span>
                </Link>
              </div>

              {/* Quick Trust Metrics */}
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-8 sm:grid-cols-4 dark:border-zinc-800">
                <div>
                  <div className="text-2xl font-black text-zinc-900 sm:text-3xl dark:text-white">120K+</div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Passes Issued</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-violet-600 sm:text-3xl dark:text-violet-400">1,400+</div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Live Gatherings</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-zinc-900 sm:text-3xl dark:text-white">0.8s</div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Gate Scan Speed</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600 sm:text-3xl dark:text-emerald-400">99.9%</div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Check-in Reliability</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Holographic Interactive Pass Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                
                {/* Glowing backdrop shadow */}
                <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 opacity-30 blur-2xl filter" />

                {/* Main Pass Mockup Card */}
                <div className="relative overflow-hidden rounded-[2.2rem] border border-white/20 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-6 text-white shadow-2xl backdrop-blur-xl dark:border-zinc-800">
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white font-bold text-xs">
                        EP
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                        Official EntryPass
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-violet-300 ring-1 ring-violet-400/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-ping" />
                      VERIFIED ACCESS
                    </span>
                  </div>

                  {/* Pass Body */}
                  <div className="pt-6">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-violet-400">
                      Flagship Experience
                    </div>
                    <h3 className="mt-1 text-2xl font-extrabold text-white">
                      AI Developer Summit 2026
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Oct 10 - 11, 2026 • Grand Center, Chicago
                    </p>

                    {/* Attendee Details Grid */}
                    <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-zinc-800/60 p-4 border border-zinc-700/40">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-400">Attendee</div>
                        <div className="text-sm font-semibold text-zinc-100">{demoAttendeeName}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-400">Pass Tier</div>
                        <div className="text-sm font-bold text-violet-300">{demoPassType} ACCESS</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-400">Gate / Zone</div>
                        <div className="text-sm font-semibold text-zinc-100">Gate 3 • Tier A</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-400">Pass Reference</div>
                        <div className="font-mono text-xs font-semibold text-zinc-300">EP-98421-VX</div>
                      </div>
                    </div>

                    {/* Perforation Divider */}
                    <div className="relative my-6 flex items-center justify-between">
                      <div className="absolute -left-10 h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-950" />
                      <div className="w-full border-b-2 border-dashed border-zinc-700/80" />
                      <div className="absolute -right-10 h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-950" />
                    </div>

                    {/* QR Code & Barcode Section */}
                    <div className="flex items-center justify-between gap-4">
                      {/* Stylized QR Visual */}
                      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white p-2 text-zinc-950 shadow-inner">
                        <svg className="h-full w-full" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="5" y="5" width="28" height="28" rx="4" />
                          <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                          <rect x="13" y="13" width="12" height="12" />
                          
                          <rect x="67" y="5" width="28" height="28" rx="4" />
                          <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                          <rect x="75" y="13" width="12" height="12" />
                          
                          <rect x="5" y="67" width="28" height="28" rx="4" />
                          <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                          <rect x="13" y="75" width="12" height="12" />
                          
                          <rect x="40" y="10" width="8" height="14" />
                          <rect x="52" y="18" width="8" height="12" />
                          <rect x="40" y="32" width="18" height="8" />
                          <rect x="42" y="48" width="16" height="16" />
                          <rect x="68" y="44" width="12" height="10" />
                          <rect x="84" y="48" width="10" height="12" />
                          <rect x="66" y="68" width="14" height="12" />
                          <rect x="40" y="72" width="16" height="10" />
                          <rect x="84" y="68" width="10" height="26" />
                          <rect x="66" y="86" width="12" height="8" />
                        </svg>
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span className="font-semibold">Instant Gate Validation</span>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-400 leading-tight">
                          Show this screen or Apple / Google Wallet pass at the venue entrance scanner.
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Link
                            href="/events"
                            className="inline-flex items-center gap-1 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-700"
                          >
                            <span>Reserve Yours</span>
                            <span className="text-violet-400">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Apple Wallet style pill */}
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4 text-[11px] text-zinc-500">
                    <span>Cryptographically Signed Pass</span>
                    <span>No App Required</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORY SELECTOR / PILLS */}
      {/* ========================================================================= */}
      <section className="border-y border-zinc-200/80 bg-zinc-50/50 py-6 dark:border-zinc-800/80 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  activeCategory === cat.name
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    activeCategory === cat.name
                      ? "bg-violet-700 text-white"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED & UPCOMING EXPERIENCES */}
      {/* ========================================================================= */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                Curated Events
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                Featured Gatherings & Summits
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
                Reserve entry passes to industry-leading symposiums, masterclasses, and hands-on developer workshops.
              </p>
            </div>
            <Link
              href="/events"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
            >
              <span>View all 48 events</span>
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const bookedPercent = Math.round(((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100);
              return (
                <div
                  key={event.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {/* Top Gradient Banner with Date Badge */}
                  <div className={`relative h-40 bg-gradient-to-r ${event.gradient} p-5 text-white flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                        {event.category}
                      </span>
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                        {event.status}
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/80 font-medium">Event Date</div>
                        <div className="text-lg font-bold text-white">{event.date}</div>
                      </div>
                      <div className="rounded-xl bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                        {event.price}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold text-zinc-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                      {event.title}
                    </h3>

                    {/* Venue & Time */}
                    <div className="mt-4 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span>{event.venue} • {event.city}</span>
                      </div>
                    </div>

                    {/* Registration Capacity Progress Bar */}
                    <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>Capacity: {bookedPercent}% Claimed</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-200">{event.spotsLeft} spots left</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                          style={{ width: `${bookedPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-2">
                      <Link
                        href={`/events`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-violet-600 active:scale-95 dark:bg-zinc-800 dark:hover:bg-violet-600"
                      >
                        <span>Reserve Entry Pass</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE LIVE PASS GENERATOR WIDGET ("EXPERIENCE ENTRYPASS") */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-zinc-50 to-white py-20 dark:from-zinc-900/40 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] border border-zinc-200/90 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 lg:p-14">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              
              {/* Left Controls */}
              <div className="lg:col-span-6">
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                  Interactive Simulator
                </span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                  Experience Your Digital Pass Before You Arrive
                </h2>
                <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                  Try typing your name and select a badge type below to preview how your instant QR pass renders for events on EntryPass.
                </p>

                <div className="mt-8 space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Attendee Name
                    </label>
                    <input
                      type="text"
                      value={demoAttendeeName}
                      onChange={(e) => setDemoAttendeeName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      maxLength={30}
                      className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Badge Tier
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {(["VIP", "EXECUTIVE", "GENERAL"] as const).map((tier) => (
                        <button
                          key={tier}
                          onClick={() => setDemoPassType(tier)}
                          className={`rounded-xl py-2.5 text-xs font-bold uppercase transition ${
                            demoPassType === tier
                              ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                              : "border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-200 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                    <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-200">
                      <span className="text-emerald-500">✓</span> No download or special app needed
                    </div>
                    <p className="mt-1">
                      Guest passes work on iOS, Android, and web with zero app installs required.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Live Pass Preview */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-sm rounded-[2rem] border border-zinc-200 bg-gradient-to-b from-zinc-900 to-black p-6 text-white shadow-2xl dark:border-zinc-700">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-xs">
                        EP
                      </div>
                      <span className="text-xs font-bold tracking-widest text-zinc-400">ENTRYPASS LIVE</span>
                    </div>
                    <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/30">
                      {demoPassType} ACCESS
                    </span>
                  </div>

                  <div className="pt-6">
                    <div className="text-[10px] uppercase tracking-wider text-violet-400 font-bold">Pass Holder</div>
                    <div className="text-2xl font-black text-white truncate">{demoAttendeeName || "Guest Attendee"}</div>
                    
                    <div className="mt-4 rounded-xl bg-zinc-800/80 p-3 text-xs flex justify-between">
                      <div>
                        <div className="text-[10px] text-zinc-400">Event</div>
                        <div className="font-semibold text-zinc-200">Global Tech Summit</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400">Status</div>
                        <div className="font-semibold text-emerald-400">Active Pass</div>
                      </div>
                    </div>

                    {/* QR graphic */}
                    <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-zinc-900">
                      <div className="relative h-28 w-28">
                        <svg className="h-full w-full" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="5" y="5" width="28" height="28" rx="4" />
                          <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                          <rect x="13" y="13" width="12" height="12" />
                          
                          <rect x="67" y="5" width="28" height="28" rx="4" />
                          <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                          <rect x="75" y="13" width="12" height="12" />
                          
                          <rect x="5" y="67" width="28" height="28" rx="4" />
                          <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                          <rect x="13" y="75" width="12" height="12" />
                          
                          <rect x="42" y="15" width="8" height="12" />
                          <rect x="42" y="45" width="16" height="16" />
                          <rect x="68" y="44" width="12" height="10" />
                          <rect x="84" y="48" width="10" height="12" />
                          <rect x="40" y="72" width="16" height="10" />
                        </svg>
                      </div>
                      <span className="mt-2 font-mono text-[10px] tracking-wider text-zinc-500">
                        HASH: EP-{Math.abs(demoAttendeeName.length * 314159 % 99999).toString().padStart(5, "0")}
                      </span>
                    </div>

                    <div className="mt-4 text-center text-[11px] text-zinc-400">
                      Scan at gate for instant check-in. Valid for 1 attendee.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHY CHOOSE ENTRYPASS (PLATFORM PILLARS) */}
      {/* ========================================================================= */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              Architecture & Security
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              Built for Flawless In-Person Gate Entry
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
              From small developer meetups to stadium-scale conferences, EntryPass eliminates entry bottlenecks.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM14.625 3.75c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125h-4.5zM14.625 14.625c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125h-4.5z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-white">Instant QR Passes</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Single-tap registration delivers a cryptographic QR pass directly to email with zero passwords needed.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-white">Bot & Spam Shield</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Built-in rate limiting and Upstash verification prevents scalpers from hoarding popular event spots.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-white">Real-Time Telemetry</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Organizers track live capacity, hourly check-in bursts, and gate throughput on an executive dashboard.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-white">Bulk CSV & Excel</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Upload spreadsheets of thousands of invitees in seconds, or export check-in rosters with complete audit trails.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ORGANIZER PORTAL BANNER */}
      {/* ========================================================================= */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-900 via-indigo-900 to-zinc-950 p-8 sm:p-14 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-300 border border-violet-500/30">
                Host With Confidence
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Ready to Organize Your Next Event?
              </h2>
              <p className="mt-4 text-base text-zinc-300 leading-relaxed">
                Committee members and super admins can log in to create events, configure venue geolocations, manage staff permissions, and monitor ticket reservations.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-zinc-900 transition hover:bg-zinc-100 active:scale-95 shadow-md"
                >
                  <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  <span>Organizer Sign In</span>
                </Link>

                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
                >
                  <span>Browse Public Events</span>
                </Link>
              </div>
            </div>

            {/* Background design accents */}
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
            <div className="absolute bottom-0 right-10 hidden lg:block opacity-10">
              <svg className="h-80 w-80 text-white" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="5" width="20" height="14" rx="2" />
              </svg>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
