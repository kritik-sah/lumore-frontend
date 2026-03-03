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
} from "@/components/ui/resizable-navbar";
import { cn } from "@/lib/utils";
import { trackAnalytic } from "@/service/analytics";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MegaItem = {
  title: string;
  description: string;
  icon: string;
  href?: string;
  disabled?: boolean;
};

type MegaSection = {
  title: string;
  items: MegaItem[];
};

type PromoCard = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

type PanelFooter = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

type MegaPanel = {
  promo: PromoCard;
  sections: MegaSection[];
  footer: PanelFooter;
};

type LandingNavItem = {
  id: string;
  name: string;
  link?: string;
  panel?: MegaPanel;
};

type NavbarPlaceLink = {
  slug: string;
  placeName: string;
  region: string;
  country: string;
};

type NavbarUIProps = {
  placeLinks: NavbarPlaceLink[];
};

function getPlaceGuideItems(placeLinks: NavbarPlaceLink[]): MegaItem[] {
  return [
    {
      title: "All Place Guides",
      description: "Browse all city and neighborhood landing pages.",
      icon: "IoCompassOutline",
      href: "/place",
    },
    ...placeLinks.map((place) => ({
      title: `Dating in ${place.placeName}`,
      description: `${place.placeName}, ${place.region}`,
      icon: "FaLocationDot",
      href: `/place/${place.slug}`,
    })),
  ];
}

function getLandingNavItems(placeLinks: NavbarPlaceLink[]): LandingNavItem[] {
  return [
    {
      id: "home",
      name: "Home",
      link: "/",
    },
    {
      id: "about",
      name: "About",
      panel: {
        promo: {
          title: "Built for calmer, swipeless connections.",
          description:
            "Discover why Lumore focuses on intent, trust, and emotionally safer introductions.",
          imageSrc: "/assets/login-screen.webp",
          imageAlt: "Lumore founder portrait",
        },
        sections: [
          {
            title: "Explore Lumore",
            items: [
              {
                title: "About Lumore",
                description: "Our mission and founder story.",
                icon: "HiOutlineInformationCircle",
                href: "/about",
              },
              {
                title: "How It Works",
                description: "Understand the swipeless flow step by step.",
                icon: "HiOutlineCheckBadge",
                href: "/how-it-works",
              },
              {
                title: "What Is Swipeless Dating?",
                description: "A simpler way to meet people with intent.",
                icon: "IoMagnet",
                href: "/swipeless-dating",
              },
              {
                title: "Compare Options",
                description: "See how Lumore differs from swipe-first apps.",
                icon: "FaLocationDot",
                href: "/compare",
              },
            ],
          },
          {
            title: "Coming soon",
            items: [
              {
                title: "City Meetups",
                description: "Small trusted social circles in your city.",
                icon: "FaRegFaceSmile",
                disabled: true,
              },
              {
                title: "Offline Circles",
                description: "Community-led in-person connection sessions.",
                icon: "HiOutlineSparkles",
                disabled: true,
              },
              {
                title: "Guided Introductions",
                description: "Context-rich introductions for better starts.",
                icon: "HiMiniClock",
                disabled: true,
              },
            ],
          },
        ],
        footer: {
          title: "Need a quick overview?",
          description: "Read the full mission and product philosophy.",
          ctaLabel: "View About",
          ctaHref: "/about",
        },
      },
    },
    {
      id: "places",
      name: "Places",
      panel: {
        promo: {
          title: "Local-first city dating playbooks.",
          description:
            "Explore practical swipeless dating guides for your city and nearby neighborhoods.",
          imageSrc: "/assets/location.jpg",
          imageAlt: "Lumore place guides preview",
        },
        sections: [
          {
            title: "City Guides",
            items: getPlaceGuideItems(placeLinks),
          },
        ],
        footer: {
          title: "Looking for your city?",
          description: "Start with the full place guide index.",
          ctaLabel: "Explore Places",
          ctaHref: "/place",
        },
      },
    },

    {
      id: "blog",
      name: "Blog",
      panel: {
        promo: {
          title: "Ideas for intentional modern dating.",
          description:
            "Stories and practical insights for building better social connections.",
          imageSrc: "/assets/ref.jpg",
          imageAlt: "Lumore featured visual",
        },
        sections: [
          {
            title: "Read now",
            items: [
              {
                title: "Latest Articles",
                description: "Browse every published Lumore blog post.",
                icon: "HiOutlineDocumentText",
                href: "/blog",
              },
              {
                title: "Relationship Insights",
                description: "Actionable perspectives for real conversations.",
                icon: "HiOutlineBookOpen",
                disabled: true,
              },
              {
                title: "City Social Guides",
                description: "Local-first playbooks for meeting intentionally.",
                icon: "IoCompassOutline",
                href: "/place",
              },
            ],
          },
          {
            title: "Coming soon",
            items: [
              {
                title: "Founder Notes",
                description: "Behind-the-scenes product and community updates.",
                icon: "HiOutlineSparkles",
                disabled: true,
              },
              {
                title: "Community Stories",
                description: "Real experiences from Lumore users.",
                icon: "FaRegFaceSmile",
                disabled: true,
              },
              {
                title: "Reading Lists",
                description: "Curated resources for better dating behavior.",
                icon: "TbLibraryPlus",
                disabled: true,
              },
            ],
          },
        ],
        footer: {
          title: "Looking for fresh reads?",
          description:
            "Explore all current posts and upcoming editorial series.",
          ctaLabel: "Visit Blog",
          ctaHref: "/blog",
        },
      },
    },
  ];
}

export function NavbarUI({ placeLinks }: NavbarUIProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopItemId, setActiveDesktopItemId] = useState<string | null>(
    null,
  );
  const [openMobilePanelId, setOpenMobilePanelId] = useState<string | null>(
    null,
  );
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const landingNavItems = useMemo(
    () => getLandingNavItems(placeLinks),
    [placeLinks],
  );

  const activeDesktopItem = useMemo(
    () =>
      landingNavItems.find(
        (item) => item.id === activeDesktopItemId && item.panel,
      ),
    [activeDesktopItemId, landingNavItems],
  );

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const openDesktopPanel = useCallback(
    (itemId: string) => {
      clearCloseTimeout();
      setActiveDesktopItemId(itemId);
    },
    [clearCloseTimeout],
  );

  const closeDesktopPanel = useCallback(() => {
    clearCloseTimeout();
    setActiveDesktopItemId(null);
  }, [clearCloseTimeout]);

  const scheduleDesktopClose = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDesktopItemId(null);
    }, 120);
  }, [clearCloseTimeout]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobilePanelId(null);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      if (!next) {
        setOpenMobilePanelId(null);
      }
      return next;
    });
  };

  const toggleMobilePanel = (itemId: string) => {
    setOpenMobilePanelId((prev) => (prev === itemId ? null : itemId));
  };

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, [clearCloseTimeout]);

  useEffect(() => {
    if (!activeDesktopItemId) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target as Node)
      ) {
        closeDesktopPanel();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDesktopPanel();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeDesktopItemId, closeDesktopPanel]);

  return (
    <Navbar className="">
      <div
        ref={desktopMenuRef}
        className="relative hidden lg:block"
        onMouseEnter={clearCloseTimeout}
        onMouseLeave={scheduleDesktopClose}
      >
        <NavBody className="px-6">
          <NavbarLogo />

          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-ui-shade/10 bg-ui-light/30 p-1 backdrop-blur-sm">
              {landingNavItems.map((item) => {
                const isActive = activeDesktopItemId === item.id;

                if (item.panel) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={`mega-panel-${item.id}`}
                      onMouseEnter={() => openDesktopPanel(item.id)}
                      onFocus={() => openDesktopPanel(item.id)}
                      onClick={() => openDesktopPanel(item.id)}
                      className="relative rounded-full px-4 py-2 text-sm font-medium text-ui-shade/75 outline-none transition hover:text-ui-shade focus-visible:ring-2 focus-visible:ring-ui-highlight/60"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="landing-mega-menu-pill"
                          className="absolute inset-0 rounded-full bg-ui-shade/10"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.name}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.link || "/"}
                    onMouseEnter={closeDesktopPanel}
                    onFocus={closeDesktopPanel}
                    className="relative rounded-full px-4 py-2 text-sm font-medium text-ui-shade/75 outline-none transition hover:bg-ui-shade/10 hover:text-ui-shade focus-visible:ring-2 focus-visible:ring-ui-highlight/60"
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              className="z-10 inline-flex items-center justify-center gap-0 rounded-xl border border-ui-shade bg-ui-light px-4 py-2 text-base text-ui-shade transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
              href="https://play.google.com/store/apps/details?id=xyz.lumore.www.twa"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackAnalytic({
                  activity: "android_install",
                  label: "Android Install",
                })
              }
            >
              <Icon
                name="AiFillAndroid"
                className="text-3xl flex-shrink-0 mr-2"
              />
              Install Lumore
            </a>
          </div>
        </NavBody>

        <AnimatePresence>
          {activeDesktopItem?.panel && (
            <>
              <motion.button
                type="button"
                aria-label="Close navigation menu"
                onClick={closeDesktopPanel}
                className="fixed inset-0 z-40 bg-ui-shade/10 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.section
                id={`mega-panel-${activeDesktopItem.id}`}
                role="region"
                aria-label={`${activeDesktopItem.name} navigation menu`}
                className="absolute left-1/2 top-full z-50 mt-4 w-[min(94vw,1100px)] -translate-x-1/2"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className="rounded-[2rem] border border-ui-shade/20 bg-ui-light/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
                  <div className="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
                    <article className="relative min-h-[420px] overflow-hidden rounded-[1.6rem] border border-ui-shade/20 bg-ui-shade/90">
                      <Image
                        src={activeDesktopItem.panel.promo.imageSrc}
                        alt={activeDesktopItem.panel.promo.imageAlt}
                        className="h-full w-full object-cover"
                        fill
                        sizes="330px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ui-shade/80 via-ui-shade/30 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-ui-light">
                        <h3 className="text-3xl font-semibold leading-tight">
                          {activeDesktopItem.panel.promo.title}
                        </h3>
                        <p className="mt-3 text-sm text-ui-light/80">
                          {activeDesktopItem.panel.promo.description}
                        </p>
                      </div>
                    </article>

                    <div className="flex min-w-0 flex-col justify-between gap-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        {activeDesktopItem.panel.sections.map((section) => (
                          <section key={section.title}>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-ui-shade/60">
                              {section.title}
                            </h4>
                            <div className="mt-3 space-y-2">
                              {section.items.map((menuItem) => {
                                const rowClassName =
                                  "group flex w-full items-start gap-3 rounded-2xl border border-ui-shade/10 bg-ui-background/45 p-3 text-left transition";
                                const iconClassName =
                                  "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ui-shade/10 bg-ui-light";

                                if (menuItem.disabled || !menuItem.href) {
                                  return (
                                    <div
                                      key={menuItem.title}
                                      aria-disabled="true"
                                      className={cn(
                                        rowClassName,
                                        "cursor-not-allowed opacity-60",
                                      )}
                                    >
                                      <span className={iconClassName}>
                                        <Icon
                                          name={menuItem.icon}
                                          className="h-4 w-4 text-ui-shade/60"
                                        />
                                      </span>
                                      <span className="min-w-0">
                                        <span className="block truncate text-base font-medium text-ui-shade/80">
                                          {menuItem.title}
                                        </span>
                                        <span className="block text-sm text-ui-shade/70">
                                          {menuItem.description}
                                        </span>
                                      </span>
                                    </div>
                                  );
                                }

                                return (
                                  <Link
                                    key={menuItem.title}
                                    href={menuItem.href}
                                    onClick={closeDesktopPanel}
                                    className={cn(
                                      rowClassName,
                                      "hover:border-ui-shade/20 hover:bg-ui-light",
                                    )}
                                  >
                                    <span className={iconClassName}>
                                      <Icon
                                        name={menuItem.icon}
                                        className="h-4 w-4 text-ui-shade/70 transition group-hover:text-ui-highlight"
                                      />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="block truncate text-base font-medium text-ui-shade">
                                        {menuItem.title}
                                      </span>
                                      <span className="block text-sm text-ui-shade/70">
                                        {menuItem.description}
                                      </span>
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </section>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-ui-shade/10 bg-ui-background/45 px-4 py-4">
                        <div>
                          <p className="text-lg font-semibold text-ui-shade">
                            {activeDesktopItem.panel.footer.title}
                          </p>
                          <p className="text-sm text-ui-shade/70">
                            {activeDesktopItem.panel.footer.description}
                          </p>
                        </div>
                        <Link
                          href={activeDesktopItem.panel.footer.ctaHref}
                          onClick={closeDesktopPanel}
                          className="inline-flex items-center justify-center rounded-full border border-ui-shade bg-ui-shade px-5 py-2.5 text-sm font-semibold text-ui-light transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
                        >
                          {activeDesktopItem.panel.footer.ctaLabel}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            </>
          )}
        </AnimatePresence>
      </div>

      <MobileNav className="lg:hidden">
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={handleMobileMenuToggle}
          />
        </MobileNavHeader>

        <MobileNavMenu
          className="max-h-[75vh] overflow-y-auto"
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        >
          {landingNavItems.map((item) => {
            if (!item.panel) {
              return (
                <Link
                  key={`mobile-link-${item.id}`}
                  href={item.link || "/"}
                  onClick={closeMobileMenu}
                  className="relative w-full rounded-xl px-1 py-2 text-base font-medium text-ui-shade/80"
                >
                  <span className="block">{item.name}</span>
                </Link>
              );
            }

            const isPanelOpen = openMobilePanelId === item.id;

            return (
              <div
                key={`mobile-panel-${item.id}`}
                className="w-full rounded-2xl border border-ui-shade/10 bg-ui-background/30"
              >
                <button
                  type="button"
                  aria-expanded={isPanelOpen}
                  aria-controls={`mobile-mega-panel-${item.id}`}
                  onClick={() => toggleMobilePanel(item.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="text-base font-semibold text-ui-shade">
                    {item.name}
                  </span>
                  <Icon
                    name="FaChevronDown"
                    className={cn(
                      "h-4 w-4 text-ui-shade/70 transition-transform",
                      isPanelOpen && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isPanelOpen && (
                    <motion.div
                      id={`mobile-mega-panel-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 px-4 pb-4">
                        {item.panel.sections.map((section) => (
                          <section key={`${item.id}-${section.title}`}>
                            <p className="text-xs font-semibold uppercase tracking-wide text-ui-shade/60">
                              {section.title}
                            </p>
                            <div className="mt-2 space-y-2">
                              {section.items.map((menuItem) => {
                                if (menuItem.disabled || !menuItem.href) {
                                  return (
                                    <div
                                      key={`${item.id}-${menuItem.title}`}
                                      aria-disabled="true"
                                      className="flex items-start gap-3 rounded-xl border border-ui-shade/10 bg-ui-light/40 p-3 opacity-60"
                                    >
                                      <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-ui-shade/10 bg-ui-light">
                                        <Icon
                                          name={menuItem.icon}
                                          className="h-3.5 w-3.5 text-ui-shade/60"
                                        />
                                      </span>
                                      <span className="min-w-0">
                                        <span className="block text-sm font-medium text-ui-shade/80">
                                          {menuItem.title}
                                        </span>
                                        <span className="block text-xs text-ui-shade/70">
                                          {menuItem.description}
                                        </span>
                                      </span>
                                    </div>
                                  );
                                }

                                return (
                                  <Link
                                    key={`${item.id}-${menuItem.title}`}
                                    href={menuItem.href}
                                    onClick={closeMobileMenu}
                                    className="flex items-start gap-3 rounded-xl border border-ui-shade/10 bg-ui-light p-3"
                                  >
                                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-ui-shade/10 bg-ui-background/45">
                                      <Icon
                                        name={menuItem.icon}
                                        className="h-3.5 w-3.5 text-ui-shade/75"
                                      />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="block text-sm font-medium text-ui-shade">
                                        {menuItem.title}
                                      </span>
                                      <span className="block text-xs text-ui-shade/70">
                                        {menuItem.description}
                                      </span>
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </section>
                        ))}

                        <Link
                          href={item.panel.footer.ctaHref}
                          onClick={closeMobileMenu}
                          className="inline-flex w-full items-center justify-center rounded-xl border border-ui-shade bg-ui-shade px-4 py-2.5 text-sm font-semibold text-ui-light"
                        >
                          {item.panel.footer.ctaLabel}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <div className="flex w-full flex-col gap-4">
            <a
              className="z-10 inline-flex items-center justify-center gap-0 rounded-xl border border-ui-shade bg-ui-light px-4 py-2 text-base text-ui-shade transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
              href="https://play.google.com/store/apps/details?id=xyz.lumore.www.twa"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackAnalytic({
                  activity: "android_install",
                  label: "Android Install",
                })
              }
            >
              <Icon
                name="AiFillAndroid"
                className="text-3xl flex-shrink-0 mr-2"
              />
              Install Lumore
            </a>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

export default NavbarUI;
