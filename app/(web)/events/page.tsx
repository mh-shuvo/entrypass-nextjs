"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";

type EventStatus = "REGISTRATION OPEN" | "FEW SPOTS LEFT" | "FEATURED" | "COMPLETED";

interface EventItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: "AI & Data" | "Cloud & Security" | "Full Stack" | "DevOps" | "Architecture";
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  city: string;
  price: string;
  totalSpots: number;
  spotsLeft: number;
  status: EventStatus;
  gradient: string;
  tags: string[];
}

const mockEventsData: EventItem[] = [
  {
    id: 1,
    slug: "ai-developer-summit-2026",
    title: "AI Developer Summit 2026",
    description: "A two-day conference focusing on Generative AI, LLMs, RAG architectures, autonomous AI agents, and production developer tools.",
    category: "AI & Data",
    startDate: "Oct 10, 2026",
    endDate: "Oct 11, 2026",
    startTime: "09:00 AM",
    endTime: "06:00 PM",
    venue: "Grand Center Auditorium",
    city: "Chicago, IL",
    price: "Free Access",
    totalSpots: 500,
    spotsLeft: 38,
    status: "FEW SPOTS LEFT",
    gradient: "from-violet-600 via-indigo-600 to-purple-800",
    tags: ["LLMs", "RAG", "AI Agents", "Python"],
  },
  {
    id: 2,
    slug: "nextjs-fullstack-bootcamp",
    title: "Next.js 16 Full Stack Bootcamp",
    description: "Learn how to build production-ready fullstack applications using Next.js App Router, React 19, Prisma ORM, and high-performance databases.",
    category: "Full Stack",
    startDate: "Nov 05, 2026",
    endDate: "Nov 06, 2026",
    startTime: "08:30 AM",
    endTime: "06:00 PM",
    venue: "Harbor Tech Studio",
    city: "Seattle, WA",
    price: "Free Access",
    totalSpots: 350,
    spotsLeft: 112,
    status: "REGISTRATION OPEN",
    gradient: "from-blue-600 via-indigo-600 to-cyan-600",
    tags: ["Next.js", "React 19", "Prisma", "TypeScript"],
  },
  {
    id: 3,
    slug: "cyber-security-awareness-day",
    title: "Cyber Security & Threat Defense Day",
    description: "In-depth masterclass covering zero trust architecture, threat intelligence, API attack vectors, and automated cloud incident response.",
    category: "Cloud & Security",
    startDate: "Nov 20, 2026",
    endDate: "Nov 20, 2026",
    startTime: "10:00 AM",
    endTime: "04:30 PM",
    venue: "Summit Hall A",
    city: "Austin, TX",
    price: "Free Access",
    totalSpots: 400,
    spotsLeft: 95,
    status: "FEATURED",
    gradient: "from-emerald-600 via-teal-600 to-cyan-700",
    tags: ["Zero Trust", "Security", "Threat Intel", "OAuth"],
  },
  {
    id: 4,
    slug: "zero-trust-security-summit",
    title: "Zero Trust Security Summit 2026",
    category: "Cloud & Security",
    description: "Explore identity-first security, network micro-segmentation, and practical defensive strategies for safeguarding high-value organizations.",
    startDate: "Dec 02, 2026",
    endDate: "Dec 02, 2026",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    venue: "Cedar Conference Hall",
    city: "Boston, MA",
    price: "Free Access",
    totalSpots: 250,
    spotsLeft: 24,
    status: "FEW SPOTS LEFT",
    gradient: "from-amber-600 via-orange-600 to-rose-700",
    tags: ["Identity", "Cloud", "IAM", "Infrastructure"],
  },
  {
    id: 5,
    slug: "annual-tech-fest-2026",
    title: "Annual Tech Fest & Hack Showcase",
    category: "Full Stack",
    description: "A flagship technology festival featuring keynote sessions, live hack showcases, startup demos, and community networking opportunities.",
    startDate: "Dec 12, 2026",
    endDate: "Dec 13, 2026",
    startTime: "09:00 AM",
    endTime: "08:00 PM",
    venue: "Riverfront Tech Arena",
    city: "Miami, FL",
    price: "Free Access",
    totalSpots: 800,
    spotsLeft: 240,
    status: "REGISTRATION OPEN",
    gradient: "from-fuchsia-600 via-pink-600 to-rose-600",
    tags: ["Hackathon", "Startups", "Keynotes", "Community"],
  },
  {
    id: 6,
    slug: "devops-platform-engineering-summit",
    title: "DevOps & Platform Engineering Summit",
    category: "DevOps",
    description: "Discuss internal developer platforms (IDPs), Kubernetes cluster orchestration, GitOps automation, and resilient CI/CD pipelines.",
    startDate: "Jan 18, 2027",
    endDate: "Jan 19, 2027",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    venue: "Union Convention Center",
    city: "San Diego, CA",
    price: "Free Access",
    totalSpots: 350,
    spotsLeft: 84,
    status: "REGISTRATION OPEN",
    gradient: "from-sky-600 via-blue-600 to-indigo-800",
    tags: ["Kubernetes", "GitOps", "Terraform", "CI/CD"],
  },
  {
    id: 7,
    slug: "database-reliability-and-performance",
    title: "Database Reliability & High-Scale Systems",
    category: "Architecture",
    description: "Advanced indexing patterns, distributed transactions, database failover orchestration, and storage optimization for heavy workloads.",
    startDate: "Feb 08, 2027",
    endDate: "Feb 08, 2027",
    startTime: "09:30 AM",
    endTime: "05:00 PM",
    venue: "Capitol Technology Center",
    city: "Washington, DC",
    price: "Free Access",
    totalSpots: 300,
    spotsLeft: 145,
    status: "REGISTRATION OPEN",
    gradient: "from-rose-600 via-pink-600 to-purple-700",
    tags: ["PostgreSQL", "MySQL", "Scalability", "Caching"],
  },
  {
    id: 8,
    slug: "kubernetes-deployment-bootcamp",
    title: "Kubernetes Cloud Deployment Bootcamp",
    category: "DevOps",
    description: "Hands-on containerized operations with Kubernetes, covering ingress controllers, secrets management, canary rollouts, and autoscaling.",
    startDate: "Feb 24, 2027",
    endDate: "Feb 25, 2027",
    startTime: "09:00 AM",
    endTime: "05:30 PM",
    venue: "Crescent Innovation Hall",
    city: "New Orleans, LA",
    price: "Free Access",
    totalSpots: 200,
    spotsLeft: 18,
    status: "FEW SPOTS LEFT",
    gradient: "from-teal-600 via-emerald-600 to-sky-700",
    tags: ["K8s", "Docker", "Helm", "Cloud"],
  },
  {
    id: 9,
    slug: "llm-application-engineering-day",
    title: "LLM Application Engineering Intensive",
    category: "AI & Data",
    description: "Deep dive into model evaluation, prompt optimization, structured JSON output extraction, function calling, and vector search embeddings.",
    startDate: "Mar 12, 2027",
    endDate: "Mar 12, 2027",
    startTime: "09:30 AM",
    endTime: "04:30 PM",
    venue: "Lumen Center",
    city: "San Jose, CA",
    price: "Free Access",
    totalSpots: 450,
    spotsLeft: 190,
    status: "REGISTRATION OPEN",
    gradient: "from-purple-600 via-indigo-600 to-pink-600",
    tags: ["Embeddings", "Fine-Tuning", "Vector DB", "Evaluation"],
  },
];

const categoryList = [
  "All",
  "AI & Data",
  "Cloud & Security",
  "Full Stack",
  "DevOps",
  "Architecture",
] as const;

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "spots" | "title">("date");

  // Reservation Modal State
  const [activeReservationEvent, setActiveReservationEvent] = useState<EventItem | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [ticketTier, setTicketTier] = useState<"General" | "VIP" | "Speaker">("General");
  const [isReserving, setIsReserving] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState<{
    reference: string;
    event: EventItem;
    name: string;
    email: string;
    tier: string;
  } | null>(null);

  // Filtered & Sorted Events
  const filteredEvents = useMemo(() => {
    return mockEventsData
      .filter((event) => {
        // Search Filter
        const matchesQuery =
          searchQuery === "" ||
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category Filter
        const matchesCategory =
          selectedCategory === "All" || event.category === selectedCategory;

        // Status Filter
        const matchesStatus =
          selectedStatus === "ALL" ||
          (selectedStatus === "OPEN" && event.status === "REGISTRATION OPEN") ||
          (selectedStatus === "FEW" && event.status === "FEW SPOTS LEFT") ||
          (selectedStatus === "FEATURED" && event.status === "FEATURED");

        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "spots") return a.spotsLeft - b.spotsLeft;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return a.id - b.id; // date default
      });
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Handle Mock Pass Reservation
  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) {
      toast.error("Please provide both your name and email.");
      return;
    }

    setIsReserving(true);

    setTimeout(() => {
      const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const reference = `EP-${new Date().getFullYear()}-${randomCode}`;
      
      setConfirmedPass({
        reference,
        event: activeReservationEvent!,
        name: guestName,
        email: guestEmail,
        tier: ticketTier,
      });

      setIsReserving(false);
      toast.success("Pass confirmed! Your entry ticket is ready.");
    }, 600);
  };

  const closeModal = () => {
    setActiveReservationEvent(null);
    setConfirmedPass(null);
    setGuestName("");
    setGuestEmail("");
  };

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

          {/* Search & Quick Controls Bar */}
          <div className="mt-8 grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 shadow-sm backdrop-blur-sm sm:grid-cols-12 dark:border-zinc-800 dark:bg-zinc-900/90">
            {/* Search Input */}
            <div className="relative sm:col-span-6">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event title, city, topic, or venue..."
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-zinc-400 hover:text-zinc-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                aria-label="Filter events by status"
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 px-3 text-sm text-zinc-800 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Registration Open</option>
                <option value="FEW">Few Spots Remaining</option>
                <option value="FEATURED">Featured Experiences</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "spots" | "title")}
                aria-label="Sort events by criteria"
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 px-3 text-sm text-zinc-800 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="date">Sort: Upcoming Date</option>
                <option value="spots">Sort: Most Urgent / Spots Left</option>
                <option value="title">Sort: Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN EVENT LISTINGS */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        
        {/* Results Counter and Active Filter Tags */}
        <div className="flex items-center justify-between pb-6">
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Showing <span className="font-bold text-zinc-900 dark:text-white">{filteredEvents.length}</span> event{filteredEvents.length === 1 ? "" : "s"}
            {selectedCategory !== "All" && <span> in <span className="text-violet-600">{selectedCategory}</span></span>}
            {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
          </div>

          {(selectedCategory !== "All" || searchQuery !== "" || selectedStatus !== "ALL") && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setSelectedStatus("ALL");
              }}
              className="text-xs font-semibold text-violet-600 hover:underline dark:text-violet-400"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">No matching events found</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Try adjusting your search query, selecting another category, or resetting all filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setSelectedStatus("ALL");
              }}
              className="mt-6 rounded-full bg-violet-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-violet-700"
            >
              Show All Events
            </button>
          </div>
        )}

        {/* Event Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const bookedPercent = Math.round(
              ((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100
            );

            return (
              <article
                key={event.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Visual Header Banner */}
                <div className={`relative h-44 bg-gradient-to-r ${event.gradient} p-5 text-white flex flex-col justify-between`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-black/35 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                      {event.category}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        event.status === "FEW SPOTS LEFT"
                          ? "bg-amber-500/90 text-white"
                          : event.status === "FEATURED"
                          ? "bg-violet-900/90 text-violet-200"
                          : "bg-emerald-600/90 text-white"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                      {event.venue}
                    </div>
                    <div className="text-sm font-semibold text-white/95">
                      {event.city}
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
                    <span>{event.startDate}</span>
                    <span>•</span>
                    <span>{event.startTime}</span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="mt-3 text-xl font-bold text-zinc-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 transition-colors">
                    {event.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {event.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Spacer to push bottom section down */}
                  <div className="mt-auto pt-6">
                    {/* Capacity Indicator */}
                    <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{bookedPercent}% Booked</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {event.spotsLeft} passes remaining
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                          style={{ width: `${bookedPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() => {
                          setActiveReservationEvent(event);
                          setConfirmedPass(null);
                        }}
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
            );
          })}
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE DIGITAL PASS RESERVATION MODAL */}
      {/* ========================================================================= */}
      {activeReservationEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            
            {/* Modal Header */}
            <div className={`p-6 text-white bg-gradient-to-r ${activeReservationEvent.gradient}`}>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  1-Click Pass Reservation
                </span>
                <button
                  onClick={closeModal}
                  className="rounded-full bg-black/20 p-1.5 hover:bg-black/40 transition"
                  aria-label="Close dialog"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h2 className="mt-3 text-2xl font-bold">{activeReservationEvent.title}</h2>
              <p className="mt-1 text-xs text-white/80">
                {activeReservationEvent.startDate} • {activeReservationEvent.venue}, {activeReservationEvent.city}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {!confirmedPass ? (
                /* Reservation Form */
                <form onSubmit={handleReserveSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Attendee Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Email Address (Pass Delivery)
                    </label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="e.g. sarah@example.com"
                      className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                    <p className="mt-1 text-[11px] text-zinc-500">
                      Your unique QR code pass and booking token will be sent directly to this address.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Pass Tier
                    </label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {(["General", "VIP", "Speaker"] as const).map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setTicketTier(tier)}
                          className={`rounded-xl py-2 text-xs font-bold uppercase transition ${
                            ticketTier === tier
                              ? "bg-violet-600 text-white shadow-sm"
                              : "border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-violet-50 p-3.5 text-xs text-violet-900 dark:bg-violet-950/60 dark:text-violet-200 border border-violet-100 dark:border-violet-900">
                    <span className="font-semibold">✓ Free Admission Guaranteed:</span> No account or credit card required. Fast-track entry at the venue gate.
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isReserving}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-violet-700 disabled:opacity-50 active:scale-95 transition"
                    >
                      {isReserving ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          <span>Issuing Digital Pass...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm & Generate Entry Pass</span>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Confirmed Pass Digital Ticket */
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  
                  <h3 className="mt-3 text-xl font-bold text-zinc-900 dark:text-white">
                    Pass Confirmed!
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Your digital pass has been generated. Show the QR code below at the door.
                  </p>

                  {/* Holographic simulated ticket */}
                  <div className="mt-5 rounded-2xl bg-zinc-950 p-5 text-white shadow-xl text-left border border-zinc-800">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-violet-400">
                        {confirmedPass.tier} PASS
                      </div>
                      <div className="font-mono text-xs text-zinc-400 font-semibold">
                        {confirmedPass.reference}
                      </div>
                    </div>

                    <div className="py-4">
                      <div className="text-lg font-bold text-white">{confirmedPass.name}</div>
                      <div className="text-xs text-zinc-400">{confirmedPass.email}</div>
                      <div className="mt-2 text-xs font-medium text-emerald-400">
                        ✓ Verified • {confirmedPass.event.title}
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex items-center justify-center rounded-xl bg-white p-3">
                      <div className="h-24 w-24">
                        <svg className="h-full w-full text-zinc-900" viewBox="0 0 100 100" fill="currentColor">
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
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => {
                        toast.success("Pass downloaded to your device!");
                      }}
                      className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    >
                      Save to Wallet / PDF
                    </button>
                    <button
                      onClick={closeModal}
                      className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition dark:border-zinc-800 dark:text-zinc-300"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
