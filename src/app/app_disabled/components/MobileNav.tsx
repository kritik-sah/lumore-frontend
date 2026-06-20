import Icon from "@/components/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMobileNavItems } from "./layout/nav-config";

export default function MobileNav() {
  const pathname = usePathname();
  const navItems = getMobileNavItems();

  const isActivePath = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="bg-bg-surface border-t border-border-default/20 px-4 py-3">
      <ul className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = isActivePath(item.href);
          return (
            <li key={item.href} className="w-full px-3 ">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center ${
                  isActive
                    ? "text-text-primary"
                    : "text-text-primary/60 hover:text-text-primary"
                }`}
              >
                <Icon name={item.icon} className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

