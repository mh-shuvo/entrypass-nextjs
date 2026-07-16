import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EntryPass",
  description: "A simple event management system built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

            </div>

          </div> 

        </div>
        {children}
      </body>
    </html>
  );
}
