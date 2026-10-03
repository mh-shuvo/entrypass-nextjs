"use server";

import { EVENT_STATUS, type Event } from "@prisma/client";

import { requirePermission } from "@/lib/authz";
import { ActionResult } from "@/lib/utils";
import { EventSchema, type EventCreateState } from "@/lib/validation/event";
import {EventService} from "@/services/event.service"
import { EventRepository } from "@/repository/event.repository"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { removeEventMedia } from "@/lib/event-media-storage";


const eventWriteActions = async (
    payload: EventCreateState,
    eventSlug?: string
): Promise<ActionResult<Event>> => {
    const permissionCheck = await requirePermission("manage_events");
    if (!permissionCheck.success) {
        return { success: false, error: permissionCheck.error };
    }

    let currentEventStatus: EVENT_STATUS | undefined;
    if (eventSlug !== undefined) {
        if (typeof eventSlug !== "string" || !eventSlug.trim()) {
            return { success: false, error: "Invalid event." };
        }

        const existingEvent = await prisma.event.findUnique({
            where: { event_slug: eventSlug, deletedAt: null },
            select: { event_slug: true, status: true },
        });
        if (!existingEvent) {
            return { success: false, error: "Event not found." };
        }
        currentEventStatus = existingEvent.status;
    }

    const nextPayload = {
        ...payload,
        status: currentEventStatus ?? payload.status ?? EVENT_STATUS.DRAFT,
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

    const result = await eventService.upsert(parsed.data, eventSlug);

    if (eventSlug) {
        revalidatePath(`/dashboard/events/${eventSlug}`);
        revalidatePath("/dashboard/events");
    }
    return { success: true, data: result };
};

const getManageableEvent = async (slug: string) => {
    if (typeof slug !== "string" || !slug.trim()) {
        return { success: false as const, error: "Invalid event." };
    }

    const permissionCheck = await requirePermission("manage_events");
    if (!permissionCheck.success) {
        return { success: false as const, error: permissionCheck.error };
    }

    const event = await prisma.event.findUnique({
        where: { event_slug: slug, deletedAt: null },
    });

    if (!event) {
        return { success: false as const, error: "Event not found." };
    }

    return { success: true as const, event };
};

const updateEventStatusAction = async (
    slug: string,
    status: EVENT_STATUS
): Promise<ActionResult<Event>> => {
    const access = await getManageableEvent(slug);
    if (!access.success) return access;
    if (!Object.values(EVENT_STATUS).includes(status)) {
        return { success: false, error: "Invalid event status." };
    }
    if (status === EVENT_STATUS.PUBLISHED && (!access.event.startDate || !access.event.endDate)) {
        return { success: false, error: "Add an event start and end date before publishing." };
    }

    try {
        const event = await new EventService(new EventRepository()).updateEventStatus(slug, status);
        revalidatePath(`/dashboard/events/${slug}`);
        revalidatePath("/dashboard/events");
        return { success: true, data: event };
    } catch (error) {
        console.error("updateEventStatusAction failed", error);
        return { success: false, error: "Unable to update the event status." };
    }
};

const archiveEventAction = async (slug: string): Promise<ActionResult> => {
    const access = await getManageableEvent(slug);
    if (!access.success) return access;

    try {
        await new EventService(new EventRepository()).archiveEvent(slug);
        revalidatePath("/dashboard/events");
        return { success: true, data: undefined };
    } catch (error) {
        console.error("archiveEventAction failed", error);
        return { success: false, error: "Unable to archive the event." };
    }
};

const deleteEventAction = async (slug: string): Promise<ActionResult> => {
    const access = await getManageableEvent(slug);
    if (!access.success) return access;

    try {
        const media = await prisma.eventMedia.findMany({
            where: { eventId: access.event.id },
            select: { storageKey: true },
        });
        await new EventService(new EventRepository()).deleteEvent(slug);
        const cleanupResults = await Promise.allSettled(
            media.map(({ storageKey }) => removeEventMedia(storageKey))
        );
        cleanupResults.forEach((result) => {
            if (result.status === "rejected") {
                console.error("Deleted event but failed to remove stored media", result.reason);
            }
        });
        revalidatePath("/dashboard/events");
        return { success: true, data: undefined };
    } catch (error) {
        console.error("deleteEventAction failed", error);
        return { success: false, error: "Unable to delete the event." };
    }
};

export {
    eventWriteActions,
    updateEventStatusAction,
    archiveEventAction,
    deleteEventAction,
};