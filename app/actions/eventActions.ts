"use server";

import { EVENT_STATUS, type Event } from "@prisma/client";

import { requirePermission } from "@/lib/authz";
import { ActionResult } from "@/lib/utils";
import { EventSchema, type EventCreateState } from "@/lib/validation/event";
import {EventService} from "@/services/event.service"
import { EventRepository } from "@/repository/event.repository"


const eventWriteActions = async (payload: EventCreateState): Promise<ActionResult<Event>> => {
    const permissionCheck = await requirePermission("manage_events");
    if (!permissionCheck.success) {
        return { success: false, error: permissionCheck.error };
    }

    const nextPayload = {
        ...payload,
        status: payload.status ?? EVENT_STATUS.DRAFT,
    };

    if (nextPayload.status === EVENT_STATUS.PUBLISHED && (!nextPayload.startDate || !nextPayload.endDate)) {
        return {
            success: false,
            error: "Publishing requires a start date and end date.",
            fieldErrors: {
                startDate: "Start date is required before publishing.",
                endDate: "End date is required before publishing.",
            },
        };
    }

    const parsed = await EventSchema.safeParseAsync(nextPayload);
    if (!parsed.success) {
        const nextFieldErrors: Partial<Record<keyof EventCreateState, string>> = {};

        for (const issue of parsed.error.issues) {
            const fieldName = issue.path[0] as keyof EventCreateState;
            if (!nextFieldErrors[fieldName]) {
                nextFieldErrors[fieldName] = issue.message;
            }
        }

        return {
            success: false,
            error: "Validation failed",
            fieldErrors: nextFieldErrors,
        };
    }

    const eventService = new EventService(new EventRepository())

    const result = await eventService.upsert(parsed.data)

    return { success: true, data: result };
};

export { eventWriteActions };