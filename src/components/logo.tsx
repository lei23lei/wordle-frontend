export default function Logo() {
  // "WORDLE" with colored squares for the first 5 letters
  const letters = [
    { char: "W", color: "bg-green-600 text-white" },
    { char: "O", color: "bg-yellow-400 text-black" },
    {
      char: "R",
      color: "bg-gray-300 text-black dark:bg-gray-700 dark:text-white",
    },
    { char: "D", color: "bg-green-600 text-white" },
    { char: "L", color: "bg-yellow-400 text-black" },
    {
      char: "E",
      color: "bg-gray-300 text-black dark:bg-gray-700 dark:text-white",
    },
  ];

  // Animation delays for wave effect (not used now, but kept for possible future use)
  // const delays = [0, 0.1, 0.2, 0.3, 0.4, 0.5];

  return (
    <div className="flex items-end gap-1 select-none">
      {letters.map((l, i) => (
        <span
          key={i}
          className={`
            w-10 h-10 text-2xl
            md:w-16 md:h-16 md:text-4xl
            lg:w-20 lg:h-20 lg:text-5xl
            rounded-md font-bold flex items-center justify-center shadow-sm
            ${l.color}
            transition-all
            animate-float
          `}
          style={{
            letterSpacing: "0.05em",
            // No curve or rotation
          }}
        >
          {l.char}
        </span>
      ))}
    </div>
  );
}
