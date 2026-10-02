import type { Event } from "@prisma/client";
export type EventListType = {
    data: Event[];
    currentPage:number;
    totalPages:number;
    totalItems:number;
    perPage:number;
    summary:{
        total:number;
        published:number;
        draft:number;
        ongoing:number;
        completed:number;
        cancelled:number;
    }
}

export type EventStatus = "DRAFT" | "PUBLISHED" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type StatusFilter = "ALL" | EventStatus;
export type DateFilter = "ALL" | "UPCOMING" | "PAST" | "THIS_MONTH" | "NEXT_30_DAYS" | "CUSTOM";
export type SortOption = "newest" | "oldest" | "title" | "start-date";

export type EventListFilterParams = {
    page?: number;
    q?: string | undefined;
    status?: StatusFilter;
    date?: DateFilter;
    sort?: SortOption;
    startDate?: string | null;
    endDate?: string | null;
}
