import { LucideDices, LucideMessageCircle, User } from "lucide-react";
import Link from "next/link";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <ul className="flex justify-between items-center">
        <li>
          <Link href="/app" className="text-gray-700 hover:text-black">
            <LucideDices size={24} />
          </Link>
        </li>
        <li>
          <Link href="/app/slots" className="text-gray-700 hover:text-black">
            <LucideMessageCircle size={24} />
          </Link>
        </li>

        <li>
          <Link href="/app/profile" className="text-gray-700 hover:text-black">
            <User size={24} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
