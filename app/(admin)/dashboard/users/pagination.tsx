"use client";

import { usePathname, useSearchParams,useRouter } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const disabledButtonStyles = "disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-neutral-secondary-high"
    const buttonStyles = "text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-base text-sm px-3 h-9 focus:outline-none cursor-pointer";
    const router = useRouter();
    const handlePageChange = (page: number) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("page", page.toString());
        const newUrl = `${pathname}?${newSearchParams.toString()}`;
        router.push(newUrl);
    }
    return (
        <>
            <div className="flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        disabled={currentPage === index + 1}
                        className={currentPage === index + 1 ? buttonStyles + " " + disabledButtonStyles : buttonStyles}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </>
    );
}