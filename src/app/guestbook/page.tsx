import type { Metadata } from "next";
import { GuestbookClient } from "@/components/guestbook/guestbook-client";

export const metadata: Metadata = {
  title: "留言墙",
  description: "留下你的足迹，每一张便签都是一份温暖。",
};

export default function GuestbookPage() {
  return <GuestbookClient />;
}
