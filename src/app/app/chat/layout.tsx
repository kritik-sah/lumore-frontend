import type { Metadata } from "next";
import { ChatProvider } from "../context/ChatContext";

export const metadata: Metadata = {
  title: "Lumore - Help's you socialize your way!",
  description:
    "Lumore connects you instantly with like-minded people through real-time, anonymous chat, eliminating endless swiping.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}
