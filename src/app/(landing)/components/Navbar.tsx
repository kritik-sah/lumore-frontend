// components/Navbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PopupButton } from "@typeform/embed-react";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";

const menuList = [
  { name: "Home", link: "/" },
  // { name: "About", link: "/about" },
  { name: "Features", link: "#features" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center py-5 px-4 lg:px-10 bg-ui-light">
      {/* Logo */}
      <h1 className="text-xl font-bold">
        <Link href="/">Lumore</Link>
      </h1>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-4">
        <ul className="flex space-x-6">
          {menuList.map((item) => (
            <li key={item.name}>
              <Link
                href={item.link}
                className="text-ui-shade hover:text-ui-accent"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <PopupButton id="ITzseckk">
          <Button variant="outline" size="lg" className="text-base">
            Join waitlist <span className="text-ui-highlight">!!</span>
          </Button>
        </PopupButton>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <HiOutlineMenu
              className="text-3xl cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div>
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <ul className="space-y-4">
                {menuList.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.link}
                      className="text-lg text-ui-shade hover:text-ui-accent"
                      onClick={() => setOpen(false)} // Close menu on click
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
