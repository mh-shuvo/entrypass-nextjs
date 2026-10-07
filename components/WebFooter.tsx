import Link from "next/link";

export default function WebFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/70 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-700 to-indigo-500 text-white shadow-md shadow-violet-500/20">
                <svg
                  className="h-4.5 w-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                  <circle cx="7" cy="15" r="1" fill="currentColor" />
                  <circle cx="12" cy="15" r="1" fill="currentColor" />
                  <circle cx="17" cy="15" r="1" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Entry<span className="text-violet-600">Pass</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              The modern ticketing & digital pass ecosystem. Seamless QR entry, verified passes, and comprehensive tools for conference organizers.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
              <span>•</span>
              <span>Next.js 16 Ready</span>
            </div>
          </div>

          {/* Nav column 1 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/events" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                  All Events
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                  Tech & AI Summits
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                  Developer Workshops
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                  Free Registrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav column 2 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Organizers
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                  Organizer Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                  Executive Portal
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                  Features & Roles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                  Request Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav column 3: About & Help */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                  Contact Support
                </Link>
              </li>
              <li>
                <span className="text-zinc-400 dark:text-zinc-600 cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-zinc-400 dark:text-zinc-600 cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:flex-row">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} EntryPass. All rights reserved. Designed for fast and verified event entry.
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>Instant Digital Pass</span>
            <span>•</span>
            <span>QR Validation</span>
            <span>•</span>
            <span>Zero Queue Entry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
