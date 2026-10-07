import type { Metadata } from "next";
import "../globals.css";
import { getServerSession } from "next-auth/next";
import { geistSans, geistMono } from "../fonts";
import { authOptions } from "@/lib/auth";
import { Toaster } from 'sonner';
import WebNavbar from "@/components/WebNavbar";
import WebFooter from "@/components/WebFooter";

export const metadata: Metadata = {
  title: "EntryPass — Instant Digital Passes & Event Access",
  description: "Discover extraordinary events and get instant, verified digital passes. Simple, secure event registration and organizer tools.",
};

export default async function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-violet-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100" suppressHydrationWarning>
        <WebNavbar isAuthenticated={!!session} />
        <main className="flex-1">{children}</main>
        <WebFooter />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
