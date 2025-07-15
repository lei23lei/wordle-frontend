"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, MoonStar } from "lucide-react";
import { useEffect, useState } from "react";
import SmallLogo from "./small-logo";

export default function Nav() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme toggle with better system theme support
  const handleThemeToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (theme === "system") {
        // If currently on system, switch to the opposite of system preference
        setTheme(systemTheme === "dark" ? "light" : "dark");
      } else {
        // Toggle between light and dark
        setTheme(theme === "dark" ? "light" : "dark");
      }
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 200);
  };

  if (!mounted) return null;

  // Determine the current effective theme for icon
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="container mx-auto">
      <div className="w-full  h-16 flex items-center justify-between px-6">
        <Link
          href="/"
          className="hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <SmallLogo />
        </Link>
        <div className="flex flex-row gap-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="h-8 w-8 overflow-hidden rounded-full transition-colors hover:bg-white dark:hover:bg-zinc-500"
            disabled={isAnimating}
          >
            <div
              className={`transition-transform duration-300 ${
                isAnimating ? "scale-90" : "scale-100"
              } ${effectiveTheme === "dark" ? "rotate-0" : "rotate-180"}`}
            >
              {effectiveTheme === "dark" ? (
                <MoonStar className="h-10 scale-125 w-10 text-yellow-300" />
              ) : (
                <Sun className="h-10 scale-125 w-10 text-amber-800" />
              )}
            </div>
            <span className="sr-only">Toggle dark mode</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
