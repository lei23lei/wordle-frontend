interface RowProps {
  letters: string[];
  states?: ("empty" | "filled" | "correct" | "present" | "absent")[];
  shake?: boolean;
}

export function Row({ letters, states, shake }: RowProps) {
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
        return `${baseClasses} bg-keyBoardCorrect text-white border-keyBoardCorrect`;
      case "present":
        return `${baseClasses} bg-keyBoardPresent text-white border-keyBoardPresent`;
      case "absent":
        return `${baseClasses} bg-keyBoardAbsent text-white border-keyBoardAbsent`;
      case "filled":
        return `${baseClasses} bg-background text-foreground border-gray-400 scale-105`;
      default: // empty
        return `${baseClasses} bg-background text-foreground border-border`;
    }
  };

  return (
    <div
      className={`flex flex-row gap-1 sm:gap-2 ${shake ? "animate-shake" : ""}`}
    >
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
  hasNotification?: boolean;
}

export default function Blanks({
  guesses,
  currentGuess,
  guessStates,
  hasNotification,
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
            return (
              <Row key={index} letters={currentGuess} shake={hasNotification} />
            );
          } else {
            // Empty row
            return <Row key={index} letters={[]} />;
          }
        })}
    </div>
  );
}
