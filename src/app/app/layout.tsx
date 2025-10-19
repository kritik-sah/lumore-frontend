import Provider from "@/app/app/context/index";
import type { Metadata } from "next";
import LumoreSplash from "./components/LumoreSplash";
import { ExploreChatProvider } from "./context/ExploreChatContext";

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
  return (
    <Provider>
      <ExploreChatProvider>
        <LumoreSplash />
        <div className="h-screen">
          <main className="flex flex-col h-full">{children}</main>
        </div>
      </ExploreChatProvider>
    </Provider>
  );
}
