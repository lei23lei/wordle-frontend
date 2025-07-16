interface KeyboardProps {
  onKeyPress: (key: string) => void;
  correctKeys?: string[];
  presentKeys?: string[];
  absentKeys?: string[];
}

export default function Keyboard({
  onKeyPress,
  correctKeys = [],
  presentKeys = [],
  absentKeys = [],
}: KeyboardProps) {
  const topRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const middleRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const bottomRow = ["Z", "X", "C", "V", "B", "N", "M"];

  const getKeyClassName = (key: string) => {
    const baseClasses =
      "min-w-[32px] sm:min-w-[40px] h-14 sm:h-12 mx-0.5 sm:m-1 rounded font-bold text-xs sm:text-sm uppercase cursor-pointer select-none flex items-center justify-center touch-manipulation key-3d relative z-10";

    if (correctKeys.includes(key)) {
      return `${baseClasses} bg-keyBoardCorrect text-white shadow-lg`;
    }

    if (presentKeys.includes(key)) {
      return `${baseClasses} bg-keyBoardPresent text-white shadow-lg`;
    }

    if (absentKeys.includes(key)) {
      return `${baseClasses} bg-keyBoardAbsent text-white shadow-lg`;
    }

    return `${baseClasses} bg-keyBoardBackground text-keyBoardText hover:bg-gray-100 dark:hover:bg-gray-600 active:bg-gray-500`;
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2 pb-6 sm:pb-0">
      {/* Top Row */}
      <div className="flex justify-center mb-1 sm:mb-2">
        {topRow.map((key) => (
          <button
            key={key}
            className={getKeyClassName(key)}
            onClick={() => onKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Middle Row */}
      <div className="flex justify-center mb-1 sm:mb-2">
        {middleRow.map((key) => (
          <button
            key={key}
            className={getKeyClassName(key)}
            onClick={() => onKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Bottom Row with Enter and Backspace */}
      <div className="flex justify-center">
        <button
          className={
            getKeyClassName("ENTER") +
            " min-w-[46px] sm:min-w-[56px] px-2 sm:px-4"
          }
          onClick={() => onKeyPress("ENTER")}
        >
          <span className="hidden sm:inline">Enter</span>
          <span className="sm:hidden">↵</span>
        </button>
        {bottomRow.map((key) => (
          <button
            key={key}
            className={getKeyClassName(key)}
            onClick={() => onKeyPress(key)}
          >
            {key}
          </button>
        ))}
        <button
          className={
            getKeyClassName("BACKSPACE") +
            " min-w-[48px] sm:min-w-[44px] px-2 sm:px-4"
          }
          onClick={() => onKeyPress("BACKSPACE")}
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
