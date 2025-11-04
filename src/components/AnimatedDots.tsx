"use client";
import React, { useEffect, useState } from "react";

interface AnimatedDotsProps {
  text: string;
  className?: string;
  dotClassName?: string;
  speed?: number; // milliseconds between dot changes
}

const AnimatedDots: React.FC<AnimatedDotsProps> = ({
  text,
  className = "",
  dotClassName = "",
  speed = 500,
}) => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4); // Cycles through 0, 1, 2, 3
    }, speed);

    return () => clearInterval(interval);
  }, [speed]);

  return (
    <span className={className}>
      {text}
      <span
        className={`inline-block ${dotClassName}`}
        style={{
          width: "1.5em", // Reserve space for 3 dots
          textAlign: "left",
        }}
      >
        {".".repeat(dots)}
      </span>
    </span>
  );
};

export default AnimatedDots;
