import type { Metadata } from "next";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { geistSans, geistMono } from "../fonts";
import { authOptions } from "@/auth";
import AuthNav from "@/components/AuthNav";

export const metadata: Metadata = {
  title: "EntryPass",
  description: "A simple event management system built with Next.js and Tailwind CSS.",
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
      <body className="min-h-full flex flex-col">
        <div className="flex flex-row bg-zinc-100 font-sans dark:bg-black">
          <div className="basis-64 p-10">
            <Link href="/">
              <Image
                src="/window.svg"
                alt="Logo"
                width={20}
                height={20}
              />
            </Link>
          </div>

          <div className="basis-full p-10">

            <div className="flex flex-row">

              <div className="basis-64">
                <Link href="/">Home</Link>
              </div>

              <div className="basis-64">
                <Link href="/events">Events</Link>
              </div>

              <div className="basis-64">
                <Link href="/about">About</Link>
              </div>
              
              <div className="basis-64">
                <Link href="/contact">Contact</Link>
              </div>

              
              <div className="basis-64">
                <AuthNav isAuthenticated={!!session} />
              </div>

            </div>

          </div> 

        </div>
        {children}
      </body>
    </html>
  );
}
