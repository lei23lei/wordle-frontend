export default function Logo() {
  // "MY" letters - same style as WORDLE
  const myLetters = [
    { char: "M", color: "bg-green-600 text-white" },
    { char: "Y", color: "bg-yellow-400 text-black" },
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
      {/* MY row */}
      <div className="flex items-end gap-1">
        {myLetters.map((l, i) => (
          <span
            key={`my-${i}`}
            className={`
              w-8 h-8 text-lg
              md:w-12 md:h-12 md:text-2xl
              lg:w-16 lg:h-16 lg:text-3xl
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
