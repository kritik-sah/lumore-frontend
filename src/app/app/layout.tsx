import Provider from "@/app/app/context/index";
import type { Metadata } from "next";
import GeneralHeader from "./components/headers/General";
import LumoreSplash from "./components/LumoreSplash";
import MobileNav from "./components/MobileNav";
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
        <div className="flex flex-col h-screen">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </ExploreChatProvider>
    </Provider>
  );
}
