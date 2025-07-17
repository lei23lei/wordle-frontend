"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function CustomizedButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Don't render until theme is resolved

  const isDark = resolvedTheme === "dark";

  // Light and dark wood styles
  const borderImage = isDark
    ? "linear-gradient(135deg, #5b3a1b 0%, #7c4a1e 40%, #a0522d 60%, #4b2e13 100%) 1"
    : "linear-gradient(135deg, #c68642 0%, #e0ac69 40%, #f1c27d 60%, #a4753b 100%) 1";
  const boxShadow = isDark
    ? "0 2px 6px rgba(0,0,0,0.15), 0 0 0 4px #4b2e13 inset"
    : "0 2px 6px rgba(0,0,0,0.12), 0 0 0 4px #e0ac69 inset";

  return (
    <button
      type={type}
      className={`
        relative px-6 py-2  font-bold text-green-50
        bg-gradient-to-b from-green-500 via-green-600 to-green-700
        shadow-[0_2px_6px_rgba(0,0,0,0.12)]
        border-4
        border-solid
        border-transparent
        transition-all duration-200
        hover:brightness-105 hover:shadow-lg
        hover:scale-105
        active:translate-y-0.5 active:brightness-90
        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        overflow-hidden
        before:absolute before:inset-0 before:rounded-lg before:pointer-events-none
        before:border-4 before:border-solid before:border-transparent
        before:bg-none
        ${className}
      `}
      style={{
        borderImage,
        boxShadow,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Optional: add a subtle wood texture overlay inside the button */}
      <span
        className="absolute inset-0 rounded-lg opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
