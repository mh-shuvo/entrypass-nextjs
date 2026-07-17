import type { Event } from "@prisma/client";

export default function EventCard({ event }: { event: Event }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 m-2">
            <h2 className="text-xl font-bold">{event.title}</h2>
            <p>{event.description}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4 items-center">
                <div>
                    <span 
                        className="
                        inline-flex items-center rounded-md bg-blue-50 text-xs 
                        px-2 py-1 font-medium text-blue-600 ring-1 ring-inset 
                        inset-ring-blue-500/10
                        ">{event.startDate.toLocaleDateString()}
                        </span>
                </div>
                <div className="flex justify-end">
                    <button
                        className="inline-flex rounded-md bg-indigo-600 px-2 
                        py-1 text-sm font-medium text-white 
                        transition-all hover:bg-indigo-700 hover:shadow-md 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 
                        focus:ring-offset-2"
                        >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    )
}