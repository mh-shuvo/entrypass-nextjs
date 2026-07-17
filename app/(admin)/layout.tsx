import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";
import { geistSans, geistMono } from "../fonts";
import Providers from "@/components/Providers";
import SidebarUserMenu from "@/components/SidebarUserMenu";

export const metadata: Metadata = {
  title: "EntryPass Admin",
  description: "EntryPass admin dashboard.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full dark:bg-black">
        <Providers>
          <div className="flex min-h-screen">
            <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-zinc-200 p-6 dark:border-zinc-800">
              <div>
                <div className="mb-8 text-lg font-semibold">EntryPass Admin</div>
                <nav className="flex flex-col gap-2 text-sm">
                  <Link href="/dashboard" className="rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    Dashboard
                  </Link>
                </nav>
              </div>
              <SidebarUserMenu />
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
