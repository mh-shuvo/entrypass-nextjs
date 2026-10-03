import { notFound } from "next/navigation";
import EventDetailsClient, { type EventDetailsData } from "@/components/Event/EventDetailsClient";
import { EventService } from "@/services/event.service";
import { EventRepository } from "@/repository/event.repository";
import { mediaUrl } from "@/lib/event-media";

interface EventViewPageProps {
  params: Promise<{ slug: string}>;
  searchParams:Promise<{ [key: string]: string | string[] | undefined }>
}

const eventService = new EventService(new EventRepository());
export default async function EventViewPage({params,searchParams}:EventViewPageProps) {
  const { slug } = await params;
  const {mode} = await searchParams;
  const event = await eventService.getEventBySlug(slug);

  if (!event || event.deletedAt) notFound();

  const [banner, supportingFiles] = [event.banner ?? null, event.media ?? []];

  const eventDetails: EventDetailsData = {
    event_slug: event.event_slug,
    title: event.title,
    description: event.description,
    startDate: event.startDate?.toISOString() ?? null,
    endDate: event.endDate?.toISOString() ?? null,
    regStart: event.regStart?.toISOString() ?? null,
    regEnd: event.regEnd?.toISOString() ?? null,
    status: event.status,
    venue: event.venue,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    banner: banner ? {
      id: banner.id,
      kind: "BANNER",
      name: banner.originalName,
      mimeType: banner.mimeType,
      sizeBytes: banner.sizeBytes,
      url: mediaUrl(event.event_slug, banner.id),
      createdAt: banner.createdAt.toISOString(),
    } : null,
    supportingFiles: supportingFiles.map((media) => ({
      id: media.id,
      kind: "SUPPORTING",
      name: media.originalName,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes,
      url: mediaUrl(event.event_slug, media.id),
      createdAt: media.createdAt.toISOString(),
    })),
  };

  return <EventDetailsClient event={eventDetails} defaultEditing={mode === "edit"} />;
}