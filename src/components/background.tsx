"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Background() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 -z-10 w-full h-full transition-all duration-2000 ease-in-out">
      {/* Sky */}
      <div
        className={`absolute inset-0 transition-all duration-2000 ease-in-out ${
          isDark
            ? "bg-gradient-to-b from-black via-blue-950 to-blue-900"
            : "bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200"
        }`}
      />
      {/* Curved Grass */}
      <svg
        className="absolute bottom-0 left-0 w-full transition-all duration-2000 ease-in-out"
        height="22vh"
        viewBox="0 0 1440 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ minHeight: "120px", maxHeight: "220px" }}
        preserveAspectRatio="none"
      >
        {/* Background grass layer */}
        <path
          d="M0,80 Q360,180 720,120 T1440,120 V220 H0 Z"
          fill={
            isDark ? "url(#grass-gradient-night)" : "url(#grass-gradient-day)"
          }
          className="transition-all duration-2000 ease-in-out"
        />

        {/* Middle grass layer with slight variation */}
        <path
          d="M0,90 Q300,170 600,130 Q900,90 1200,140 Q1320,160 1440,130 V220 H0 Z"
          fill={
            isDark
              ? "url(#grass-mid-gradient-night)"
              : "url(#grass-mid-gradient-day)"
          }
          className="transition-all duration-2000 ease-in-out"
          opacity="0.8"
        />

        {/* Front grass layer */}
        <path
          d="M0,110 Q240,160 480,140 Q720,120 960,150 Q1200,180 1440,140 V220 H0 Z"
          fill={
            isDark
              ? "url(#grass-front-gradient-night)"
              : "url(#grass-front-gradient-day)"
          }
          className="transition-all duration-2000 ease-in-out"
          opacity="0.9"
        />

        {/* Individual grass blades for texture */}
        {[...Array(40)].map((_, i) => {
          const x = i * 36 + Math.sin(i) * 20;
          const height = 15 + Math.sin(i * 0.7) * 8;
          const curve = Math.sin(i * 0.3) * 3;
          return (
            <path
              key={`blade-${i}`}
              d={`M${x},220 Q${x + curve},${220 - height / 2} ${
                x + curve * 2
              },${220 - height}`}
              stroke={isDark ? "#15803d" : "#16a34a"}
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              className="transition-all duration-2000 ease-in-out"
            />
          );
        })}

        {/* Additional grass texture */}
        {[...Array(60)].map((_, i) => {
          const x = i * 24 + 12 + Math.cos(i) * 15;
          const height = 8 + Math.cos(i * 0.9) * 5;
          const sway = Math.sin(i * 0.5) * 2;
          return (
            <path
              key={`texture-${i}`}
              d={`M${x},220 Q${x + sway},${220 - height / 2} ${
                x + sway * 1.5
              },${220 - height}`}
              stroke={isDark ? "#166534" : "#22c55e"}
              strokeWidth="1"
              fill="none"
              opacity="0.4"
              className="transition-all duration-2000 ease-in-out"
            />
          );
        })}

        {/* Small flowers scattered in the grass */}
        {[...Array(12)].map((_, i) => {
          const x = 120 + i * 110 + Math.sin(i * 2) * 40;
          const y = 180 + Math.cos(i * 1.5) * 15;
          const flowerType = i % 3;

          if (flowerType === 0) {
            // Daisy-like flower
            return (
              <g
                key={`flower-${i}`}
                className="transition-all duration-2000 ease-in-out"
              >
                <circle cx={x} cy={y} r="3" fill="#fef08a" opacity="0.8" />
                <circle
                  cx={x - 2}
                  cy={y - 1}
                  r="2"
                  fill="white"
                  opacity="0.9"
                />
                <circle
                  cx={x + 2}
                  cy={y - 1}
                  r="2"
                  fill="white"
                  opacity="0.9"
                />
                <circle
                  cx={x - 1}
                  cy={y + 2}
                  r="2"
                  fill="white"
                  opacity="0.9"
                />
                <circle
                  cx={x + 1}
                  cy={y + 2}
                  r="2"
                  fill="white"
                  opacity="0.9"
                />
                <circle cx={x} cy={y} r="1.5" fill="#fbbf24" />
              </g>
            );
          } else if (flowerType === 1) {
            // Small wildflower
            return (
              <g
                key={`flower-${i}`}
                className="transition-all duration-2000 ease-in-out"
              >
                <circle cx={x} cy={y} r="2" fill="#ec4899" opacity="0.8" />
                <circle
                  cx={x - 1.5}
                  cy={y - 0.5}
                  r="1.5"
                  fill="#f472b6"
                  opacity="0.7"
                />
                <circle
                  cx={x + 1.5}
                  cy={y - 0.5}
                  r="1.5"
                  fill="#f472b6"
                  opacity="0.7"
                />
                <circle
                  cx={x}
                  cy={y + 1.5}
                  r="1.5"
                  fill="#f472b6"
                  opacity="0.7"
                />
                <circle cx={x} cy={y} r="0.8" fill="#fbbf24" />
              </g>
            );
          } else {
            // Tiny blue flower
            return (
              <g
                key={`flower-${i}`}
                className="transition-all duration-2000 ease-in-out"
              >
                <circle cx={x} cy={y} r="1.5" fill="#3b82f6" opacity="0.7" />
                <circle
                  cx={x - 1}
                  cy={y - 0.5}
                  r="1"
                  fill="#60a5fa"
                  opacity="0.8"
                />
                <circle
                  cx={x + 1}
                  cy={y - 0.5}
                  r="1"
                  fill="#60a5fa"
                  opacity="0.8"
                />
                <circle cx={x} cy={y + 1} r="1" fill="#60a5fa" opacity="0.8" />
                <circle cx={x} cy={y} r="0.5" fill="white" />
              </g>
            );
          }
        })}

        {/* Small stones/pebbles for added realism */}
        {[...Array(8)].map((_, i) => {
          const x = 80 + i * 170 + Math.sin(i * 3) * 30;
          const y = 200 + Math.cos(i * 2) * 8;
          const size = 2 + Math.sin(i) * 1.5;
          return (
            <ellipse
              key={`stone-${i}`}
              cx={x}
              cy={y}
              rx={size}
              ry={size * 0.7}
              fill={isDark ? "#374151" : "#6b7280"}
              opacity="0.6"
              className="transition-all duration-2000 ease-in-out"
            />
          );
        })}

        <defs>
          {/* Day gradients */}
          <linearGradient id="grass-gradient-day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="30%" stopColor="#16a34a" />
            <stop offset="70%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          <linearGradient
            id="grass-mid-gradient-day"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <linearGradient
            id="grass-front-gradient-day"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="40%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Night gradients */}
          <linearGradient id="grass-gradient-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="30%" stopColor="#15803d" />
            <stop offset="70%" stopColor="#14532d" />
            <stop offset="100%" stopColor="#052e16" />
          </linearGradient>
          <linearGradient
            id="grass-mid-gradient-night"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="50%" stopColor="#14532d" />
            <stop offset="100%" stopColor="#052e16" />
          </linearGradient>
          <linearGradient
            id="grass-front-gradient-night"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#166534" />
            <stop offset="40%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>
      </svg>
      {/* Clouds or Stars */}
      <div className="transition-all duration-2000 ease-in-out">
        {isDark ? (
          // Night: Beautiful starry sky with twinkling and shooting stars
          <>
            {/* Large Bright Star */}
            <div
              className={`absolute top-12 left-1/4 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle-bright" : "opacity-0"
              }`}
              style={{ animationDelay: "0s" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
                  fill="#fef08a"
                  opacity="0.9"
                />
                <circle cx="8" cy="8" r="2" fill="#ffffff" opacity="0.8" />
              </svg>
            </div>

            {/* Medium Star */}
            <div
              className={`absolute top-32 right-1/3 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle" : "opacity-0"
              }`}
              style={{ animationDelay: "1.2s" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z"
                  fill="#fbbf24"
                  opacity="0.8"
                />
              </svg>
            </div>

            {/* Small Bright Star */}
            <div
              className={`absolute top-16 right-1/4 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle-fast" : "opacity-0"
              }`}
              style={{ animationDelay: "0.4s" }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4L5 0Z"
                  fill="#ffffff"
                  opacity="0.9"
                />
              </svg>
            </div>

            {/* Tiny Star */}
            <div
              className={`absolute top-8 left-1/3 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle" : "opacity-0"
              }`}
              style={{ animationDelay: "1.5s" }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path
                  d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2L4 0Z"
                  fill="#e0e7ff"
                  opacity="0.7"
                />
              </svg>
            </div>

            {/* Medium Golden Star */}
            <div
              className={`absolute top-20 left-1/5 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle-bright" : "opacity-0"
              }`}
              style={{ animationDelay: "0.9s" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z"
                  fill="#fef08a"
                  opacity="0.8"
                />
                <circle cx="7" cy="7" r="1.5" fill="#ffffff" opacity="0.6" />
              </svg>
            </div>

            {/* Small Star */}
            <div
              className={`absolute top-28 left-2/3 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle" : "opacity-0"
              }`}
              style={{ animationDelay: "1.8s" }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M4.5 0L5.4 3.6L9 4.5L5.4 5.4L4.5 9L3.6 5.4L0 4.5L3.6 3.6L4.5 0Z"
                  fill="#ffffff"
                  opacity="0.8"
                />
              </svg>
            </div>

            {/* Bright Star */}
            <div
              className={`absolute top-10 right-1/5 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle-fast" : "opacity-0"
              }`}
              style={{ animationDelay: "0.6s" }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M6.5 0L7.8 5.2L13 6.5L7.8 7.8L6.5 13L5.2 7.8L0 6.5L5.2 5.2L6.5 0Z"
                  fill="#fef3c7"
                  opacity="0.9"
                />
                <circle
                  cx="6.5"
                  cy="6.5"
                  r="1.5"
                  fill="#ffffff"
                  opacity="0.7"
                />
              </svg>
            </div>

            {/* Small Golden Star */}
            <div
              className={`absolute top-14 right-1/2 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle" : "opacity-0"
              }`}
              style={{ animationDelay: "1.1s" }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4L5 0Z"
                  fill="#fbbf24"
                  opacity="0.8"
                />
              </svg>
            </div>

            {/* Large Blue-White Star */}
            <div
              className={`absolute top-40 left-1/2 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle-bright" : "opacity-0"
              }`}
              style={{ animationDelay: "1.7s" }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M7.5 0L9 6L15 7.5L9 9L7.5 15L6 9L0 7.5L6 6L7.5 0Z"
                  fill="#dbeafe"
                  opacity="0.9"
                />
                <circle cx="7.5" cy="7.5" r="2" fill="#ffffff" opacity="0.8" />
              </svg>
            </div>

            {/* Tiny Star */}
            <div
              className={`absolute top-44 left-1/4 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle-fast" : "opacity-0"
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                <path
                  d="M3.5 0L4.2 2.8L7 3.5L4.2 4.2L3.5 7L2.8 4.2L0 3.5L2.8 2.8L3.5 0Z"
                  fill="#ffffff"
                  opacity="0.7"
                />
              </svg>
            </div>

            {/* Medium Star */}
            <div
              className={`absolute top-48 right-1/3 transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-100 animate-star-twinkle" : "opacity-0"
              }`}
              style={{ animationDelay: "1.3s" }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M5.5 0L6.6 4.4L11 5.5L6.6 6.6L5.5 11L4.4 6.6L0 5.5L4.4 4.4L5.5 0Z"
                  fill="#fef08a"
                  opacity="0.8"
                />
              </svg>
            </div>

            {/* Additional smaller stars */}
            <div
              className={`absolute top-24 left-1/6 w-1 h-1 bg-white rounded-full transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-60 animate-star-twinkle-slow" : "opacity-0"
              }`}
              style={{ animationDelay: "2.1s" }}
            />
            <div
              className={`absolute top-36 right-1/6 w-1 h-1 bg-yellow-200 rounded-full transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-50 animate-star-twinkle-slow" : "opacity-0"
              }`}
              style={{ animationDelay: "2.7s" }}
            />
            <div
              className={`absolute top-52 left-1/3 w-0.5 h-0.5 bg-white rounded-full transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-40 animate-star-twinkle-slow" : "opacity-0"
              }`}
              style={{ animationDelay: "3.2s" }}
            />
            <div
              className={`absolute top-18 left-2/5 w-0.5 h-0.5 bg-blue-100 rounded-full transition-all duration-2000 ease-in-out ${
                isDark ? "opacity-50 animate-star-twinkle-slow" : "opacity-0"
              }`}
              style={{ animationDelay: "2.9s" }}
            />
          </>
        ) : (
          // Day: Beautiful floating clouds
          <>
            {/* Large Cloud 1 */}
            <div
              className={`absolute top-8 left-10 transition-all duration-2000 ease-in-out ${
                !isDark ? "opacity-90 animate-float-slow" : "opacity-0"
              }`}
              style={{ animationDelay: "0s" }}
            >
              <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
                <ellipse
                  cx="25"
                  cy="35"
                  rx="15"
                  ry="12"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="45"
                  cy="30"
                  rx="20"
                  ry="15"
                  fill="white"
                  opacity="0.95"
                />
                <ellipse
                  cx="70"
                  cy="32"
                  rx="18"
                  ry="13"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="90"
                  cy="35"
                  rx="12"
                  ry="10"
                  fill="white"
                  opacity="0.85"
                />
                {/* Shadow */}
                <ellipse
                  cx="26"
                  cy="37"
                  rx="14"
                  ry="10"
                  fill="#f1f5f9"
                  opacity="0.6"
                />
                <ellipse
                  cx="46"
                  cy="32"
                  rx="18"
                  ry="12"
                  fill="#f1f5f9"
                  opacity="0.7"
                />
                <ellipse
                  cx="71"
                  cy="34"
                  rx="16"
                  ry="11"
                  fill="#f1f5f9"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Medium Cloud 2 - Hidden on mobile */}
            <div
              className={`absolute top-20 right-32 transition-all duration-2000 ease-in-out hidden md:block ${
                !isDark ? "opacity-85 animate-float-medium" : "opacity-0"
              }`}
              style={{ animationDelay: "2s" }}
            >
              <svg width="90" height="45" viewBox="0 0 90 45" fill="none">
                <ellipse
                  cx="20"
                  cy="25"
                  rx="12"
                  ry="10"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="35"
                  cy="22"
                  rx="15"
                  ry="12"
                  fill="white"
                  opacity="0.95"
                />
                <ellipse
                  cx="55"
                  cy="24"
                  rx="14"
                  ry="11"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="70"
                  cy="26"
                  rx="10"
                  ry="8"
                  fill="white"
                  opacity="0.85"
                />
                {/* Shadow */}
                <ellipse
                  cx="21"
                  cy="27"
                  rx="11"
                  ry="8"
                  fill="#f1f5f9"
                  opacity="0.5"
                />
                <ellipse
                  cx="36"
                  cy="24"
                  rx="13"
                  ry="10"
                  fill="#f1f5f9"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Small Cloud 3 */}
            <div
              className={`absolute top-32 left-1/3 transition-all duration-2000 ease-in-out ${
                !isDark ? "opacity-80 animate-float-fast" : "opacity-0"
              }`}
              style={{ animationDelay: "4s" }}
            >
              <svg width="70" height="35" viewBox="0 0 70 35" fill="none">
                <ellipse
                  cx="15"
                  cy="20"
                  rx="10"
                  ry="8"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="28"
                  cy="18"
                  rx="12"
                  ry="10"
                  fill="white"
                  opacity="0.95"
                />
                <ellipse
                  cx="45"
                  cy="19"
                  rx="11"
                  ry="9"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="55"
                  cy="21"
                  rx="8"
                  ry="7"
                  fill="white"
                  opacity="0.85"
                />
                {/* Shadow */}
                <ellipse
                  cx="16"
                  cy="22"
                  rx="9"
                  ry="6"
                  fill="#f1f5f9"
                  opacity="0.5"
                />
                <ellipse
                  cx="29"
                  cy="20"
                  rx="10"
                  ry="8"
                  fill="#f1f5f9"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Large Cloud 4 */}
            <div
              className={`absolute top-12 right-10 transition-all duration-2000 ease-in-out ${
                !isDark ? "opacity-90 animate-float-slow" : "opacity-0"
              }`}
              style={{ animationDelay: "6s" }}
            >
              <svg width="110" height="55" viewBox="0 0 110 55" fill="none">
                <ellipse
                  cx="22"
                  cy="30"
                  rx="14"
                  ry="11"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="40"
                  cy="27"
                  rx="18"
                  ry="14"
                  fill="white"
                  opacity="0.95"
                />
                <ellipse
                  cx="62"
                  cy="29"
                  rx="16"
                  ry="12"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="80"
                  cy="31"
                  rx="11"
                  ry="9"
                  fill="white"
                  opacity="0.85"
                />
                {/* Shadow */}
                <ellipse
                  cx="23"
                  cy="32"
                  rx="13"
                  ry="9"
                  fill="#f1f5f9"
                  opacity="0.6"
                />
                <ellipse
                  cx="41"
                  cy="29"
                  rx="16"
                  ry="11"
                  fill="#f1f5f9"
                  opacity="0.7"
                />
              </svg>
            </div>

            {/* Medium Cloud 5 - Hidden on mobile */}
            <div
              className={`absolute top-40 right-1/4 transition-all duration-2000 ease-in-out hidden md:block ${
                !isDark ? "opacity-85 animate-float-medium" : "opacity-0"
              }`}
              style={{ animationDelay: "8s" }}
            >
              <svg width="85" height="42" viewBox="0 0 85 42" fill="none">
                <ellipse
                  cx="18"
                  cy="23"
                  rx="11"
                  ry="9"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="32"
                  cy="21"
                  rx="14"
                  ry="11"
                  fill="white"
                  opacity="0.95"
                />
                <ellipse
                  cx="50"
                  cy="22"
                  rx="13"
                  ry="10"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="65"
                  cy="24"
                  rx="9"
                  ry="7"
                  fill="white"
                  opacity="0.85"
                />
                {/* Shadow */}
                <ellipse
                  cx="19"
                  cy="25"
                  rx="10"
                  ry="7"
                  fill="#f1f5f9"
                  opacity="0.5"
                />
                <ellipse
                  cx="33"
                  cy="23"
                  rx="12"
                  ry="9"
                  fill="#f1f5f9"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Small Cloud 6 */}
            <div
              className={`absolute top-50 left-1/6 transition-all duration-2000 ease-in-out ${
                !isDark ? "opacity-80 animate-float-fast" : "opacity-0"
              }`}
              style={{ animationDelay: "10s" }}
            >
              <svg width="65" height="32" viewBox="0 0 65 32" fill="none">
                <ellipse
                  cx="13"
                  cy="18"
                  rx="9"
                  ry="7"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="25"
                  cy="16"
                  rx="11"
                  ry="9"
                  fill="white"
                  opacity="0.95"
                />
                <ellipse
                  cx="40"
                  cy="17"
                  rx="10"
                  ry="8"
                  fill="white"
                  opacity="0.9"
                />
                <ellipse
                  cx="50"
                  cy="19"
                  rx="7"
                  ry="6"
                  fill="white"
                  opacity="0.85"
                />
                {/* Shadow */}
                <ellipse
                  cx="14"
                  cy="20"
                  rx="8"
                  ry="5"
                  fill="#f1f5f9"
                  opacity="0.5"
                />
                <ellipse
                  cx="26"
                  cy="18"
                  rx="9"
                  ry="7"
                  fill="#f1f5f9"
                  opacity="0.6"
                />
              </svg>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(5px) translateY(-2px);
          }
          50% {
            transform: translateX(10px) translateY(0);
          }
          75% {
            transform: translateX(5px) translateY(2px);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          33% {
            transform: translateX(8px) translateY(-3px);
          }
          66% {
            transform: translateX(-3px) translateY(2px);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          20% {
            transform: translateX(3px) translateY(-1px);
          }
          40% {
            transform: translateX(-2px) translateY(1px);
          }
          60% {
            transform: translateX(4px) translateY(-2px);
          }
          80% {
            transform: translateX(-1px) translateY(1px);
          }
        }

        @keyframes star-twinkle {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes star-twinkle-bright {
          0%,
          100% {
            opacity: 0.9;
            transform: scale(1) rotate(0deg);
          }
          25% {
            opacity: 1;
            transform: scale(1.15) rotate(5deg);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.3) rotate(0deg);
          }
          75% {
            opacity: 1;
            transform: scale(1.1) rotate(-5deg);
          }
        }

        @keyframes star-twinkle-fast {
          0%,
          100% {
            opacity: 0.9;
            transform: scale(1);
          }
          20% {
            opacity: 0.6;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.4);
          }
          60% {
            opacity: 0.8;
            transform: scale(1.1);
          }
          80% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes star-twinkle-slow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes shooting-star {
          0% {
            opacity: 0;
            transform: translateX(0) translateY(0) rotate(-45deg);
          }
          10% {
            opacity: 1;
            transform: translateX(-10px) translateY(10px) rotate(-45deg);
          }
          90% {
            opacity: 0.8;
            transform: translateX(-100px) translateY(100px) rotate(-45deg);
          }
          100% {
            opacity: 0;
            transform: translateX(-120px) translateY(120px) rotate(-45deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 12s ease-in-out infinite;
        }

        .animate-star-twinkle {
          animation: star-twinkle 3s ease-in-out infinite;
        }

        .animate-star-twinkle-bright {
          animation: star-twinkle-bright 2.5s ease-in-out infinite;
        }

        .animate-star-twinkle-fast {
          animation: star-twinkle-fast 1.8s ease-in-out infinite;
        }

        .animate-star-twinkle-slow {
          animation: star-twinkle-slow 4s ease-in-out infinite;
        }

        .animate-shooting-star {
          animation: shooting-star 3s ease-out infinite;
          animation-iteration-count: 1;
        }
      `}</style>
    </div>
  );
}
