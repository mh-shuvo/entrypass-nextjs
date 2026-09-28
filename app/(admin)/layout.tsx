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
      <body className="min-h-full bg-slate-100 text-slate-900">
        <Providers>
          <div className="flex min-h-screen bg-slate-100">
            <aside className="flex w-72 shrink-0 flex-col justify-between border-r border-slate-200 bg-white/90 px-5 py-6 shadow-sm backdrop-blur-sm">
              <div>
                <div className="mb-8 flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 px-3 py-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white">
                    E
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">EntryPass</div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Admin</div>
                  </div>
                </div>

                <SidebarNav />
              </div>

              <SidebarUserMenu />
            </aside>

            <main className="flex-1">
              <div className="font-sans p-6 md:p-8 lg:p-10">
                <PrivateLayoutLoading>{children}</PrivateLayoutLoading>
              </div>
            </main>
          </div>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
