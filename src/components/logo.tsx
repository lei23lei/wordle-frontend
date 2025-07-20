export default function Logo() {
  // "PETER" letters - using button gradient colors
  const peterLetters = [
    {
      char: "P",
      color: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    },
    {
      char: "E",
      color: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
    },
    {
      char: "T",
      color: "bg-gradient-to-r from-purple-500 to-pink-600 text-white",
    },
    {
      char: "E",
      color: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    },
    {
      char: "R",
      color: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
    },
  ];

  // "WORDLE" with colored squares
  const wordleLetters = [
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

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      {/* PETER row */}
      <div className="flex items-end gap-1">
        {peterLetters.map((l, i) => (
          <span
            key={`peter-${i}`}
            className={`
              w-8 h-8 text-lg
              md:w-12 md:h-12 md:text-2xl
              lg:w-10 lg:h-10 lg:text-xl
              rounded-md font-bold flex items-center justify-center shadow-sm
              ${l.color}
              transition-all
              animate-float
            `}
            style={{
              letterSpacing: "0.05em",
            }}
          >
            {l.char}
          </span>
        ))}
      </div>

      {/* WORDLE row */}
      <div className="flex items-end gap-1">
        {wordleLetters.map((l, i) => (
          <span
            key={`wordle-${i}`}
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
            }}
          >
            {l.char}
          </span>
        ))}
      </div>
    </div>
  );
}
