"use client";
import Icon from "@/components/icon";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarLogo,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import SketchButton from "@/components/ui/SketchButton";
import { usePWA } from "@/hooks/usePWA";
import { useState } from "react";

export function NavbarUI() {
  const { install } = usePWA();
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Instagram",
      link: "https://www.instagram.com/0xlumore",
    },
    {
      name: "Twitter/X",
      link: "https://twitter.com/0xlumore",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <a
            href="https://play.google.com/store/apps/details?id=xyz.lumore.www.twa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SketchButton className="z-10">
              <Icon
                name="AiFillAndroid"
                className="text-3xl flex-shrink-0 mr-2"
              />
              Install Lumore
            </SketchButton>
          </a>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <a
              className="flex w-full flex-col gap-4"
              href="https://play.google.com/store/apps/details?id=xyz.lumore.www.twa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SketchButton className="z-10">
                <Icon
                  name="AiFillAndroid"
                  className="text-3xl flex-shrink-0 mr-2"
                />
                Install Lumore
              </SketchButton>
            </a>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

export default NavbarUI;
