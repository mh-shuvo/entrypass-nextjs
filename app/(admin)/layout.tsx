import type { Metadata } from "next";
import "../globals.css";
import { geistSans, geistMono } from "../fonts";
import Providers from "@/components/Providers";
import SidebarUserMenu from "@/components/SidebarUserMenu";
import SidebarNav from "@/components/SidebarNav";
import PrivateLayoutLoading from "@/components/Dashboard/Loading";
import { Toaster } from "sonner";
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

                <SidebarNav />
              </div>
              <SidebarUserMenu />
            </aside>
            <main className="flex-1">
                <div className="font-sans p-10 dark:bg-black">
                  <PrivateLayoutLoading>
                    {children}
                  </PrivateLayoutLoading>
                </div>
            </main>
          </div>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
