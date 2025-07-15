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

  // Curve values: negative is up, positive is down
  const curve = [-8, -16, -20, -16, -8, 0]; // px
  // Rotation values in degrees, negative is left, positive is right
  const rotate = [-8, -4, 0, 4, 8, 10]; // deg

  // Animation delays for wave effect
  const delays = [0, 0.1, 0.2, 0.3, 0.4, 0.5]; // seconds

  return (
    <div className="flex items-end gap-1 select-none">
      {letters.map((l, i) => (
        <span
          key={i}
          className={`
            w-14 h-14 text-3xl
            md:w-20 md:h-20 md:text-5xl
            lg:w-28 lg:h-28 lg:text-7xl
            rounded-md font-bold flex items-center justify-center shadow-sm
            ${l.color}
            transition-all
            animate-float
          `}
          style={{
            letterSpacing: "0.05em",
            // Set the base curve and rotation, animation will add to translateY
            transform: `translateY(${curve[i]}px) rotate(${rotate[i]}deg)`,
            animationDelay: `${delays[i]}s`,
          }}
        >
          {l.char}
        </span>
      ))}
    </div>
  );
}
