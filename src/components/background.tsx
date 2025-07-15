"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Background() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log(resolvedTheme);
  }, [resolvedTheme]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 -z-10 w-full h-full transition-colors duration-700">
      {/* Sky */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isDark
            ? "bg-gradient-to-b from-black via-blue-950 to-blue-900"
            : "bg-gradient-to-b from-sky-300 via-sky-200 to-green-200"
        }`}
      />
      {/* Curved Grass */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        height="22vh"
        viewBox="0 0 1440 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ minHeight: "120px", maxHeight: "220px" }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 Q360,180 720,120 T1440,120 V220 H0 Z"
          fill={
            isDark ? "url(#grass-gradient-night)" : "url(#grass-gradient-day)"
          }
        />
        <defs>
          <linearGradient id="grass-gradient-day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="grass-gradient-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>
      </svg>
      {/* Clouds or Stars */}
      {isDark ? (
        // Night: many twinkling stars
        <>
          <div
            className="absolute top-12 left-1/4 w-1 h-1 bg-yellow-100 rounded-full animate-twinkle"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-24 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: "0.7s" }}
          />
          <div
            className="absolute top-32 right-1/3 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-twinkle"
            style={{ animationDelay: "1.2s" }}
          />
          <div
            className="absolute top-16 right-1/4 w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: "0.4s" }}
          />
          <div
            className="absolute top-8 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-20 left-1/5 w-1 h-1 bg-yellow-100 rounded-full animate-twinkle"
            style={{ animationDelay: "0.9s" }}
          />
          <div
            className="absolute top-28 left-2/3 w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: "1.8s" }}
          />
          <div
            className="absolute top-10 right-1/5 w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: "0.6s" }}
          />
          <div
            className="absolute top-14 right-1/2 w-0.5 h-0.5 bg-yellow-100 rounded-full animate-twinkle"
            style={{ animationDelay: "1.1s" }}
          />
          <div
            className="absolute top-40 left-1/2 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle"
            style={{ animationDelay: "1.7s" }}
          />
          <div
            className="absolute top-44 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="absolute top-48 right-1/3 w-1 h-1 bg-yellow-100 rounded-full animate-twinkle"
            style={{ animationDelay: "1.3s" }}
          />
        </>
      ) : (
        // Day: animated clouds
        <>
          <div
            className="absolute top-10 left-10 w-32 h-16 bg-white/70 rounded-full blur-sm animate-cloud"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-20 right-20 w-40 h-20 bg-white/60 rounded-full blur-md animate-cloud"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-32 left-1/2 w-24 h-10 bg-white/50 rounded-full blur-sm animate-cloud"
            style={{ animationDelay: "4s" }}
          />
        </>
      )}
    </div>
  );
}
