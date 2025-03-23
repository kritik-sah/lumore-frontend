"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LumoreSplash() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000); // Hide after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed z-[9999] inset-0 flex flex-col items-center justify-center bg-[#f1e9da]">
      {/* Logo Animation */}
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 bg-[#FFD400] rounded-[28px] animate-pulse" />
        <div className="absolute inset-2 border-4 border-white rounded-[24px] animate-spin" />
        <div className="absolute inset-4 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Lumore"
            width={90}
            height={90}
            className="rounded-[30px]"
          />
        </div>
      </div>

      {/* Title and Description */}
      <h1 className="text-2xl font-bold text-[#1a1a1a] opacity-0 animate-fadeIn">
        Lumore
      </h1>
      <p className="text-gray-600 text-sm opacity-0 animate-fadeIn delay-200">
        Connecting you with like-minded people
      </p>

      {/* Loading Bar */}
      <div className="w-48 h-1 bg-gray-300 rounded-full overflow-hidden mt-6 opacity-0 animate-fadeIn delay-400">
        <div className="h-full bg-[#FFD400] animate-progress" />
      </div>
    </div>
  );
}
