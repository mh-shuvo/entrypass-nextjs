"use client";
import {useSession} from "next-auth/react";

export default function PrivateLayoutLoading({children}: {children: React.ReactNode}) {
    const {status} = useSession();
    if (status === "loading") {
        return (
            <div className="font-sans p-10 dark:bg-black">
            <p>Loading...</p>
            </div>
        );
    }
    return <>{children}</>;
}