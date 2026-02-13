import Icon from "@/components/icon";
import Link from "next/link";

export default function MobileNav() {
  return (
    <nav className="bg-ui-light border-t border-ui-shade/20 px-4 py-3">
      <ul className="flex justify-between items-center">
        <li className="w-full px-3 ">
          <Link
            href="/app"
            className="text-gray-700 hover:text-black flex flex-col items-center justify-center"
          >
            <Icon name="IoCompassOutline" className="h-6 w-6" />
            <span className="text-xs">Explore</span>
          </Link>
        </li>
        <li className="w-full px-3 ">
          <Link
            href="/app/chat"
            className="text-gray-700 hover:text-black flex flex-col items-center justify-center"
          >
            <Icon name="IoChatbubbleOutline" className="h-6 w-6" />
            <span className="text-xs">Chats</span>
          </Link>
        </li>
        <li className="w-full px-3 ">
          <Link
            href="/app/games"
            className="text-gray-700 hover:text-black flex flex-col items-center justify-center"
          >
            <Icon name="IoGameControllerOutline" className="h-6 w-6" />
            <span className="text-xs">Games</span>
          </Link>
        </li>
        <li className="w-full px-3 ">
          <Link
            href="/app/create-post"
            className="text-gray-700 hover:text-black flex flex-col items-center justify-center"
          >
            <Icon name="TbLibraryPlus" className="h-6 w-6" />
            <span className="text-xs">Create</span>
          </Link>
        </li>
        <li className="w-full px-3 ">
          <Link
            href="/app/profile"
            className="text-gray-700 hover:text-black flex flex-col items-center justify-center"
          >
            <Icon name="LuUser" className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
