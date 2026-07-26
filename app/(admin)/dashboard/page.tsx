import type { Metadata } from "next";
import DashboardView from "./DashboardView";
import { pageTitle } from "@/lib/metadata";

export const metadata: Metadata = pageTitle("Dashboard");

export default function DashboardPage() {
  return <DashboardView />;
}
