import {generateSlug} from "@/lib/utils"
import {EventCreateState} from "@/lib/validation/event"
import type { Event, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma"
import { EventRepository } from "@/repository/event.repository"

export class EventService{
    constructor(private eventRepository: EventRepository) {}

    async upsert(payload:EventCreateState):Promise<Event>{
        try{
            const slug = await generateSlug(payload.title, prisma.event, "event_slug");

            const data: Prisma.EventCreateInput = {
                title: payload.title,
                description: payload.description,
                startDate: payload.startDate ? new Date(payload.startDate).toISOString():null,
                endDate: payload.endDate ? new Date(payload.endDate).toISOString() : null,
                regStart: payload.regStart ? new Date(payload.regStart).toISOString() : null,
                regEnd: payload.regEnd ? new Date(payload.regEnd).toISOString() : null,
                status: payload.status,
                venue: payload.venue,
                event_slug: slug,
            };

            return await this.eventRepository.create(data);
        }
        catch(err){
            if(err instanceof Error){
                throw Error(err.message)
            }
            throw Error("An unknown error occured.")
        }
    }

}
