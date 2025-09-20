"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import SmallLogo from "./small-logo";
import DarkmodeSwitch from "./darkmode-switch";

export default function Nav() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user has visited before
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (!hasVisited) {
      // First time visitor - show tooltip after a short delay
      setTimeout(() => {
        setShowTooltip(true);
        // Mark as visited
        localStorage.setItem("hasVisitedBefore", "true");
      }, 1000);
    }
  }, []);

  // Handle theme toggle with better system theme support
  const handleThemeToggle = () => {
    console.log("handleThemeToggle called!", { theme, systemTheme });
    // Hide tooltip when user clicks the theme toggle
    setShowTooltip(false);

    if (theme === "system") {
      // If currently on system, switch to the opposite of system preference
      setTheme(systemTheme === "dark" ? "light" : "dark");
    } else {
      // Toggle between light and dark
      setTheme(theme === "dark" ? "light" : "dark");
    }
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
          <div className="relative">
            <DarkmodeSwitch
              isDark={effectiveTheme === "dark"}
              onClick={handleThemeToggle}
            />

            {/* Tooltip for first-time visitors */}
            {showTooltip && (
              <div className="absolute right-0 top-14 z-50 w-48 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                <div className="relative">
                  <div className="text-center">
                    {effectiveTheme === "dark" ? (
                      <>
                        <p className="font-medium mb-1">☀️ Light Mode</p>
                        <p className="text-xs text-gray-300">
                          Click the switch to go to light mode!
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium mb-1">🌙 Dark Mode</p>
                        <p className="text-xs text-gray-300">
                          Click the switch to go to dark mode!
                        </p>
                      </>
                    )}
                  </div>
                  {/* Arrow pointing up to the button */}
                  <div className="absolute -top-2 right-6 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
                {/* Close button */}
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 text-white rounded-full text-xs flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
