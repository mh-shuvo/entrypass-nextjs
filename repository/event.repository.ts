import prisma from "@/lib/prisma";
import type { Event, Prisma } from "@prisma/client";

export class EventRepository {
  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return prisma.event.create({ data });
  }
  async updateBySlug(eventSlug: string, data: Prisma.EventUpdateInput): Promise<Event> {
    return prisma.event.update({
      where: { event_slug: eventSlug, deletedAt: null },
      data,
    });
  }
  async archiveBySlug(eventSlug: string): Promise<Event> {
    return prisma.event.update({
      where: { event_slug: eventSlug, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
  async deleteBySlug(eventSlug: string): Promise<Event> {
    return prisma.event.delete({
      where: { event_slug: eventSlug },
    });
  }
  async findAll(page: number, sortOption:Prisma.EventOrderByWithRelationInput, filters: Prisma.EventWhereInput): Promise<[number,Event[]]> {
    return await prisma.$transaction([
      prisma.event.count({
        where: { ...filters, deletedAt: null },
      }),
      prisma.event.findMany({
        where: { ...filters, deletedAt: null },
        orderBy: sortOption,
        skip: (page - 1) * 10,
        take: 10,
      }),
    ]);
  }
  async getEventSummary(): Promise<{
    summary:{
      total: number;
      published: number;
      draft: number;
      ongoing: number;
      completed: number;
      cancelled: number;
    }
  }> {
    const allEvents = await prisma.event.findMany({
      where: { deletedAt: null },
    });
    const total = allEvents.length;
    const published = allEvents.filter(e => e.status === "PUBLISHED").length;
    const draft = allEvents.filter(e => e.status === "DRAFT").length;
    const ongoing = allEvents.filter(e => e.status === "ONGOING").length;
    const completed = allEvents.filter(e => e.status === "COMPLETED").length;
    const cancelled = allEvents.filter(e => e.status === "CANCELLED").length;
    return{
      summary:{
        total: total,
        published: published,
        draft: draft,
        ongoing: ongoing,
        completed: completed,
        cancelled: cancelled
      }
    };
  }
}
