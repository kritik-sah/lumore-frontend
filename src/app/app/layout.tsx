import Provider from "@/app/app/context/index";
import Providers from "@/app/provider";
import ServiceWorker from "@/components/ServiceWorker";
import type { Metadata } from "next";
import type { Viewport } from "next";
import { AppInteractionGuard } from "./components/layout/AppInteractionGuard";
import LumoreSplash from "./components/LumoreSplash";
import { ExploreChatProvider } from "./context/ExploreChatContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Lumore - Help's you socialize your way!",
  description:
    "Lumore connects you instantly with like-minded people through real-time, anonymous chat, eliminating endless swiping.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Provider>
        <ExploreChatProvider>
          <LumoreSplash />
          <Toaster position="top-right" />
          <ServiceWorker />
          <div className="h-[100svh]">
            <AppInteractionGuard>
              <main className="flex flex-col h-full">{children}</main>
            </AppInteractionGuard>
          </div>
        </ExploreChatProvider>
      </Provider>
    </Providers>
  );
}

