import type { Metadata } from "next";
import { NotFoundPage } from "@/components/not-found-page";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page isn’t on the React Cebu site.",
};

export default function NotFound() {
  return <NotFoundPage />;
}
