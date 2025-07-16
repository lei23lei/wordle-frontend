import React from "react";

interface ConfettiProps {
  isVisible: boolean;
}

export default function Confetti({ isVisible }: ConfettiProps) {
  if (!isVisible) return null;

  const confettiColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-rose-500",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] animate-fade-in">
      {/* Generate multiple confetti pieces */}
      {Array.from({ length: 50 }).map((_, index) => {
        const color = confettiColors[index % confettiColors.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const size = 4 + Math.random() * 8;
        const swayAmount = 15 + Math.random() * 20; // Random sway amount

        return (
          <div
            key={index}
            className={`absolute -top-10 w-2 h-2 ${color} rounded-sm animate-confetti-fall`}
            style={
              {
                left: `${left}%`,
                animationDelay: `${delay}s`,
                width: `${size}px`,
                height: `${size}px`,
                "--sway-amount": `${swayAmount}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
