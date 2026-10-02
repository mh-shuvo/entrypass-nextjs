import type { EventStatus } from "@/lib/event.types";
export const formatDate = (date: Date | null | undefined, options?: Intl.DateTimeFormatOptions) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(date);
};

export const formatDateRange = (startDate: Date | null | undefined, endDate: Date | null | undefined) => {
  const sameDay = startDate?.toDateString() === endDate?.toDateString();

  if (sameDay) {
    return formatDate(startDate, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return `${formatDate(startDate, {
    month: "short",
    day: "numeric",
  })} - ${formatDate(endDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

export const statusStyles: Record<EventStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",
  PUBLISHED: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  ONGOING: "bg-blue-100 text-blue-700 ring-blue-200",
  COMPLETED: "bg-violet-100 text-violet-700 ring-violet-200",
  CANCELLED: "bg-rose-100 text-rose-700 ring-rose-200",
};