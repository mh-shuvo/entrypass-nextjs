"use client";

import { useState } from "react";
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

const events: EventItem[] = [
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
    }
];

export default function ReservationForm() {

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
        <>
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
                                                    className={`rounded-xl py-2 text-xs font-bold uppercase transition ${ticketTier === tier
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
        </>
    );
}
