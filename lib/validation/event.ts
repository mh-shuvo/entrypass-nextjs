import { EVENT_STATUS } from "@prisma/client";
import { z } from "zod";

const optionalDateString = z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }

    const normalized = typeof value === "string" ? value.trim() : String(value);
    return normalized === "" ? undefined : normalized;
}, z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date").optional());

const EventSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(100, "Title must be under 100 characters"),
    description: z.preprocess(
        (value) => {
            if (value === undefined || value === null || value === "") {
                return undefined;
            }

            return typeof value === "string" ? value.trim() : String(value);
        },
        z.string().max(2000, "Description is too long").optional()
    ),
    startDate: optionalDateString,
    endDate: optionalDateString,
    regStart: optionalDateString,
    regEnd: optionalDateString,
    status: z.nativeEnum(EVENT_STATUS).default(EVENT_STATUS.DRAFT),
    venue: z.string().trim().min(1, "Venue is required").max(191, "Venue is too long"),
}).superRefine((data, ctx) => {
    if (data.status === EVENT_STATUS.PUBLISHED) {
        if (!data.startDate || !data.endDate) {
            ctx.addIssue({
                code: "custom",
                path: ["startDate"],
                message: "Start and end dates are required before publishing.",
            });
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "Start and end dates are required before publishing.",
            });
            return;
        }
    }

    if (data.startDate && data.endDate) {
        const start = new Date(data.startDate).getTime();
        const end = new Date(data.endDate).getTime();

        if (start > end) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date must be after the start date.",
            });
        }
    }

    if (data.startDate && data.regStart) {
        const regStart = new Date(data.regStart).getTime();
        const start = new Date(data.startDate).getTime();

        if (regStart > start) {
            ctx.addIssue({
                code: "custom",
                path: ["regStart"],
                message: "Registration start must be before the event starts.",
            });
        }
    }

    if (data.regStart && data.regEnd) {
        const regStart = new Date(data.regStart).getTime();
        const regEnd = new Date(data.regEnd).getTime();

        if (regStart > regEnd) {
            ctx.addIssue({
                code: "custom",
                path: ["regEnd"],
                message: "Registration end must be after registration start.",
            });
        }
    }
});

type EventCreateState = z.infer<typeof EventSchema>;

export { EventSchema };
export type { EventCreateState };