import AdminEventsListComponent from "@/components/Event/EventList";
import { EventRepository } from "@/repository/event.repository";
import {EventService} from "@/services/event.service";
import type { EventListType } from "@/lib/event.types"
import type { EventListFilterParams } from "@/lib/event.types"

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams?:EventListFilterParams;
}) {
  const eventService = new EventService(new EventRepository());
  const params = (await searchParams) ?? {}; 
  const events: EventListType = await eventService.getAllEvents(params);

  return (
    <div className="space-y-8">
      <AdminEventsListComponent events={events} />
    </div>
  );
}
