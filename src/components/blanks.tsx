interface LetterState {
  letter: string;
  state: "empty" | "filled" | "correct" | "present" | "absent";
}

interface RowProps {
  letters: string[];
  states?: ("empty" | "filled" | "correct" | "present" | "absent")[];
}

export function Row({ letters, states }: RowProps) {
  // Ensure we always have 5 slots
  const cells = Array(5)
    .fill(null)
    .map((_, index) => ({
      letter: letters[index] || "",
      state: states?.[index] || (letters[index] ? "filled" : "empty"),
    }));

  const getLetterClassName = (state: string) => {
    const baseClasses =
      "w-12 h-12 sm:w-16 sm:h-16 border-2 sm:border-4 rounded-md flex items-center justify-center text-lg sm:text-2xl font-bold uppercase transition-all duration-300";

    switch (state) {
      case "correct":
        return `${baseClasses} bg-green-500 text-white border-green-500`;
      case "present":
        return `${baseClasses} bg-yellow-500 text-white border-yellow-500`;
      case "absent":
        return `${baseClasses} bg-gray-600 text-white border-gray-600`;
      case "filled":
        return `${baseClasses} bg-background text-foreground border-gray-400 scale-105`;
      default: // empty
        return `${baseClasses} bg-background text-foreground border-border`;
    }
  };

  return (
    <div className="flex flex-row gap-1 sm:gap-2">
      {cells.map((cell, index) => (
        <div key={index} className={getLetterClassName(cell.state)}>
          {cell.letter}
        </div>
      ))}
    </div>
  );
}

interface BlanksProps {
  guesses: string[][];
  currentGuess: string[];
  guessStates?: ("empty" | "filled" | "correct" | "present" | "absent")[][];
}

export default function Blanks({
  guesses,
  currentGuess,
  guessStates,
}: BlanksProps) {
  const maxGuesses = 6;

  return (
    <div className="flex flex-col gap-1 sm:gap-2">
      {Array(maxGuesses)
        .fill(null)
        .map((_, index) => {
          if (index < guesses.length) {
            // Completed guess
            return (
              <Row
                key={index}
                letters={guesses[index]}
                states={guessStates?.[index]}
              />
            );
          } else if (index === guesses.length) {
            // Current guess being typed
            return <Row key={index} letters={currentGuess} />;
          } else {
            // Empty row
            return <Row key={index} letters={[]} />;
          }
        })}
    </div>
  );
}
