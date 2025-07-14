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
    let baseClasses =
      "min-w-[32px] sm:min-w-[40px] h-10 sm:h-12 mx-0.5 sm:m-1 rounded font-bold text-xs sm:text-sm uppercase transition-colors cursor-pointer select-none flex items-center justify-center touch-manipulation";

    if (correctKeys.includes(key)) {
      return `${baseClasses} bg-keyBoardCorrect text-white`;
    }

    if (presentKeys.includes(key)) {
      return `${baseClasses} bg-keyBoardPresent text-white`;
    }

    if (absentKeys.includes(key)) {
      return `${baseClasses} bg-keyBoardAbsent text-white`;
    }

    return `${baseClasses} bg-keyBoardBackground text-keyBoardText hover:bg-gray-100 dark:hover:bg-gray-600 active:bg-gray-500`;
  };

  const getSpecialKeyClassName = () => {
    return "px-2 sm:px-4 h-10 sm:h-12 mx-0.5 sm:m-1 rounded font-bold text-xs uppercase transition-colors cursor-pointer select-none bg-gray-400 text-white hover:bg-gray-500 active:bg-gray-600 flex items-center justify-center touch-manipulation";
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2">
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
            getSpecialKeyClassName() +
            " bg-keyBoardBackground hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white text-gray-800 "
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
            getSpecialKeyClassName() +
            " bg-keyBoardBackground hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white text-gray-800 "
          }
          onClick={() => onKeyPress("BACKSPACE")}
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
