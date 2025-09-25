import React from "react";

interface SketchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SketchButton: React.FC<SketchButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 flex items-center justify-center gap-0 rounded-xl border border-black bg-white text-black text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default SketchButton;
