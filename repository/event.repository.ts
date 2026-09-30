import prisma from "@/lib/prisma";
import type { Event, Prisma } from "@prisma/client";

export class EventRepository {
  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return prisma.event.create({ data });
  }
}
