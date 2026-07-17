import prisma from "@/lib/prisma";
import EventCard from "@/components/EventCard";
const events = await prisma.event.findMany();

export default function Events() {
  return (
    <div className="font-sans p-10 dark:bg-black">
        <h1 className="text-3xl">Events</h1>
        <hr />        

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>

    </div>
  );
}