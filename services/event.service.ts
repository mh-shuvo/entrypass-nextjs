import {generateSlug} from "@/lib/utils"
import {EventCreateState} from "@/lib/validation/event"
import type { Event, Prisma } from "@prisma/client";
import { EVENT_STATUS } from "@prisma/client"
import prisma from "@/lib/prisma"
import { EventRepository } from "@/repository/event.repository"
import type { EventListFilterParams, EventListType } from "@/lib/event.types"

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

    #prepareFilters(params: EventListFilterParams): Prisma.EventWhereInput {
        const { q, status, date, startDate, endDate } = params;
        const filters: Prisma.EventWhereInput = {};

        if (q) {
            filters.OR = [
                { title: { contains: q } },
                { description: { contains: q } },
            ];
        }

        if (status && status !== "ALL") {
            filters.status = status as EVENT_STATUS;
        }

        if (date && date !== "ALL") {
            const now = new Date();
            switch (date) {
                case "UPCOMING":
                    filters.startDate = { gte: now };
                    break;
                case "PAST":
                    filters.endDate = { lt: now };
                    break;
                case "THIS_MONTH":
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    filters.startDate = { gte: startOfMonth };
                    filters.endDate = { lte: endOfMonth };
                    break;
                case "NEXT_30_DAYS":
                    const next30Days = new Date();
                    next30Days.setDate(now.getDate() + 30);
                    filters.startDate = { gte: now, lte: next30Days };
                    break;
                case "CUSTOM":
                    if (startDate) {
                        filters.startDate = { gte: new Date(startDate) };
                    }
                    if (endDate) {
                        filters.endDate = { lte: new Date(endDate) };
                    }
                    break;
            }
        }

        return filters;
    }

    #prepareSortOption(sort?:string):Prisma.EventOrderByWithRelationInput{
        const sortOptions: Record<string, Prisma.EventOrderByWithRelationInput> = {
            "newest": { createdAt: "desc" },
            "oldest": { createdAt: "asc" },
            "title": { title: "asc" },
            "start-date": { startDate: "asc" },
        };
        return sortOptions[sort || "newest"] || { createdAt: "desc" };
    }

    async getAllEvents(params: EventListFilterParams): Promise<EventListType> {
        try {
            console.log("Fetching events with params:", params); 
            const { page = 1, q, status, date, sort, startDate, endDate } = params;
            const filters = this.#prepareFilters({ q, status, date, startDate, endDate });
            const sortOption = this.#prepareSortOption(sort);
            const [totalItems,events] = await this.eventRepository.findAll(page, sortOption,filters);
            const summary = await this.eventRepository.getEventSummary();
            return {
                data: events,
                currentPage: page,
                totalPages: Math.ceil(totalItems / 10),
                totalItems: totalItems,
                perPage: 10,
                ...summary
            };
        }
        catch(err){
            if(err instanceof Error){
                throw Error(err.message)
            }
            throw Error("An unknown error occured.")
        }
    }

}
