"use client";
import Link from "next/link";
import React from "react";
import { HiAdjustments } from "react-icons/hi";
import { useSocket } from "../../context/SocketContext";

const General = () => {
  const { isActive } = useSocket();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-2 md:px-0 flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/app" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Lumore</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isActive ? "bg-green-500" : "bg-gray-500"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {isActive ? "Online" : "Offline"}
            </span>
          </div>
          <div className="">
            <HiAdjustments />
          </div>
        </div>
      </div>
    </header>
  );
};

export default General;
