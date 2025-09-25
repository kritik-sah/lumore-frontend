import type { Metadata } from "next";
import Footer from "./components/Footer";
import NavbarUI from "./components/Navbar";

export const metadata: Metadata = {
  title: "Lumore - Help's you socialize your way!",
  description:
    "Lumore connects you instantly with like-minded people through real-time, anonymous chat, eliminating endless swiping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarUI />
      {children}
      <Footer />
    </>
  );
}
