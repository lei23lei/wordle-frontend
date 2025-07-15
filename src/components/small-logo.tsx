export default function SmallLogo() {
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

  return (
    <div className="flex items-end gap-0.5 select-none">
      {letters.map((l, i) => (
        <span
          key={i}
          className={`
            w-6 h-6 text-base
            md:w-8 md:h-8 md:text-lg
            rounded-md font-bold flex items-center justify-center shadow-sm
            ${l.color}
            transition-all
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
