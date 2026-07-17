import prisma from "@/lib/prisma";
import events from "./data/events.json";
import { EVENT_STATUS } from "@prisma/client";

export async function seedEvents() {
  console.log("Seeding events...");

  for (const event of events) {
    const data = {
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        regStart: new Date(event.regStart),
        regEnd: new Date(event.regEnd),
        status: event.status as EVENT_STATUS,
    };
    await prisma.event.upsert({
      where: { event_slug: event.event_slug },
      update: {},
      create: data
    });
  }
  
}