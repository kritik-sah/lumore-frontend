import { isUiSimplificationEnabled } from "@/lib/feature-flags";

export interface NavItemConfig {
  label: string;
  href: string;
  icon: string;
}

const baseNavItems: NavItemConfig[] = [
  { label: "Explore", href: "/app", icon: "IoCompassOutline" },
  { label: "Chats", href: "/app/chat", icon: "IoChatbubbleOutline" },
  { label: "Create", href: "/app/create-post", icon: "TbLibraryPlus" },
  { label: "Profile", href: "/app/profile", icon: "LuUser" },
];

const legacyNavItems: NavItemConfig[] = [
  { label: "Explore", href: "/app", icon: "IoCompassOutline" },
  { label: "Chats", href: "/app/chat", icon: "IoChatbubbleOutline" },
  { label: "Games", href: "/app/games", icon: "IoGameControllerOutline" },
  { label: "Create", href: "/app/create-post", icon: "TbLibraryPlus" },
  { label: "Profile", href: "/app/profile", icon: "LuUser" },
];

export const getMobileNavItems = (): NavItemConfig[] =>
  isUiSimplificationEnabled() ? baseNavItems : legacyNavItems;

