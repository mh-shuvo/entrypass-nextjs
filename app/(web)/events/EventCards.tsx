"use client";

import EventCard from "@/components/Event/EventCard";
import { EventListType } from "@/lib/event.types";

export default function EventCards({ events }: { events: EventListType }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.data.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
}
