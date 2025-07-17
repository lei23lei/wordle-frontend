"use client";

import Blanks from "@/components/blanks";
import Keyboard from "@/components/keyboard";
import CustomizedButton from "@/components/customized-button";
import Confetti from "@/components/confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VALID_WORDS } from "@/data/words";
import { useState, useEffect, useCallback } from "react";

type GameState = "playing" | "won" | "lost";
type DialogType = "won" | "lost" | "invalid" | "short" | null;

export default function OnePlayer() {
  const [targetWord, setTargetWord] = useState<string>("");
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [guessStates, setGuessStates] = useState<
    ("empty" | "filled" | "correct" | "present" | "absent")[][]
  >([]);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [confettiOpen, setConfettiOpen] = useState<boolean>(false);

  // Keyboard state tracking
  const [correctKeys, setCorrectKeys] = useState<string[]>([]);
  const [presentKeys, setPresentKeys] = useState<string[]>([]);
  const [absentKeys, setAbsentKeys] = useState<string[]>([]);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord =
      VALID_WORDS[Math.floor(Math.random() * VALID_WORDS.length)];
    setTargetWord(randomWord);
    setCurrentGuess([]);
    setGuesses([]);
    setGuessStates([]);
    setGameState("playing");
    setCorrectKeys([]);
    setPresentKeys([]);
    setAbsentKeys([]);
    setIsValidating(false);
    setDialogOpen(false);
    setDialogType(null);
    setNotificationMessage("");
    setConfettiOpen(false);
  };

  const showDialog = (type: DialogType) => {
    setDialogType(type);
    setDialogOpen(true);

    // Auto-close after 3 seconds for non-game-end dialogs
    if (type !== "won" && type !== "lost") {
      setTimeout(() => {
        setDialogOpen(false);
      }, 1000);
    }
  };

  const showNotification = (message: string) => {
    setNotificationMessage(message);
    // Auto-clear notification after 2 seconds
    setTimeout(() => {
      setNotificationMessage("");
    }, 2000);
  };

  // Word validation using Free Dictionary API with local fallback
  const isValidWord = async (word: string[]): Promise<boolean> => {
    const wordStr = word.join("").toUpperCase();

    // First check local word list (instant)
    if (VALID_WORDS.includes(wordStr)) {
      return true;
    }

    // If not in local list, check API
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${wordStr.toLowerCase()}`
      );
      return response.ok;
    } catch {
      // If API fails, fall back to local list only
      console.warn("Dictionary API failed, using local validation only");
      return false;
    }
  };

  const evaluateGuess = (
    guess: string[]
  ): ("correct" | "present" | "absent")[] => {
    const result: ("correct" | "present" | "absent")[] = [];
    const targetArray = targetWord.split("");
    const guessArray = [...guess];

    // First pass: mark correct letters
    for (let i = 0; i < 5; i++) {
      if (guessArray[i] === targetArray[i]) {
        result[i] = "correct";
        targetArray[i] = null as unknown as string; // Mark as used
        guessArray[i] = null as unknown as string; // Mark as used
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
      if (guessArray[i] !== null) {
        const targetIndex = targetArray.indexOf(guessArray[i]);
        if (targetIndex !== -1) {
          result[i] = "present";
          targetArray[targetIndex] = null as unknown as string; // Mark as used
        } else {
          result[i] = "absent";
        }
      }
    }

    return result;
  };

  const updateKeyboardState = useCallback(
    (guess: string[], evaluation: ("correct" | "present" | "absent")[]) => {
      const newCorrect = [...correctKeys];
      const newPresent = [...presentKeys];
      const newAbsent = [...absentKeys];

      guess.forEach((letter, index) => {
        if (evaluation[index] === "correct" && !newCorrect.includes(letter)) {
          newCorrect.push(letter);
          // Remove from present if it was there
          const presentIndex = newPresent.indexOf(letter);
          if (presentIndex !== -1) {
            newPresent.splice(presentIndex, 1);
          }
        } else if (
          evaluation[index] === "present" &&
          !newCorrect.includes(letter) &&
          !newPresent.includes(letter)
        ) {
          newPresent.push(letter);
        } else if (
          evaluation[index] === "absent" &&
          !newCorrect.includes(letter) &&
          !newPresent.includes(letter) &&
          !newAbsent.includes(letter)
        ) {
          newAbsent.push(letter);
        }
      });

      setCorrectKeys(newCorrect);
      setPresentKeys(newPresent);
      setAbsentKeys(newAbsent);
    },
    [correctKeys, presentKeys, absentKeys]
  );

  const submitGuess = useCallback(async () => {
    if (currentGuess.length !== 5) {
      showNotification("Too Short");
      return;
    }

    setIsValidating(true);

    // Validate the word
    const isValid = await isValidWord(currentGuess);

    if (!isValid) {
      setIsValidating(false);
      showNotification("Not in Dictionary");
      return;
    }

    setIsValidating(false);
    const evaluation = evaluateGuess(currentGuess);
    const newGuesses = [...guesses, currentGuess];
    const newGuessStates = [...guessStates, evaluation];

    setGuesses(newGuesses);
    setGuessStates(newGuessStates);
    updateKeyboardState(currentGuess, evaluation);

    // Check win condition
    if (evaluation.every((state) => state === "correct")) {
      setGameState("won");
      showDialog("won");
      setConfettiOpen(true);
    } else if (newGuesses.length >= 6) {
      setGameState("lost");
      showDialog("lost");
    }

    setCurrentGuess([]);
  }, [
    currentGuess,
    guesses,
    guessStates,
    targetWord,
    showNotification,
    showDialog,
    updateKeyboardState,
  ]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState !== "playing" || isValidating) return;

      if (key === "ENTER") {
        submitGuess();
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (key.length === 1 && currentGuess.length < 5) {
        setCurrentGuess((prev) => [...prev, key.toUpperCase()]);
      }
    },
    [gameState, isValidating, submitGuess, currentGuess.length]
  );

  // Handle physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard events when dialog is open
      if (dialogOpen) return;

      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handleKeyPress("ENTER");
      } else if (e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        handleKeyPress("BACKSPACE");
      } else if (e.key.match(/^[a-zA-Z]$/)) {
        e.preventDefault();
        e.stopPropagation();
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameState, isValidating, dialogOpen, handleKeyPress]);

  const getDialogContent = () => {
    switch (dialogType) {
      case "won":
        return {
          title: "🎉 Congratulations!",
          description: `You won! The word was ${targetWord}`,
          className: "text-green-600",
        };
      case "lost":
        return {
          title: "😞 Game Over",
          description: `You lost! The word was ${targetWord}`,
          className: "",
        };
      default:
        return {
          title: "",
          description: "",
          className: "",
        };
    }
  };

  const generateShareableResult = () => {
    const attempts = guesses.length;

    let result = `Wordle  ${attempts}/6\n\n`;

    // Add emoji representation of each guess
    guesses.forEach((guess, index) => {
      const states = guessStates[index];
      let emojiRow = "";

      states.forEach((state) => {
        switch (state) {
          case "correct":
            emojiRow += "🟩";
            break;
          case "present":
            emojiRow += "🟨";
            break;
          case "absent":
            emojiRow += "⬛";
            break;
          default:
            emojiRow += "⬛";
        }
      });

      result += emojiRow + "\n";
    });

    return result;
  };

  const dialogContent = getDialogContent();

  return (
    <div className="container mx-auto">
      <div className="text-center text-2xl font-bold">{targetWord}</div>
      <div className="flex relative flex-col items-center justify-start min-h-screen gap-6 py-8">
        <Blanks
          guesses={guesses}
          currentGuess={currentGuess}
          guessStates={guessStates}
          hasNotification={!!notificationMessage}
        />
        {gameState !== "playing" && (
          <CustomizedButton onClick={startNewGame} className="-my-4">
            Play Again
          </CustomizedButton>
        )}
        {/* notification */}
        {notificationMessage && (
          <div className="absolute -top-4 h-10 w-40 flex items-center border border-gray-300 justify-center font-bold bg-gray-50 rounded-sm shadow-md text-black">
            {notificationMessage}
          </div>
        )}
        <Keyboard
          onKeyPress={handleKeyPress}
          correctKeys={correctKeys}
          presentKeys={presentKeys}
          absentKeys={absentKeys}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent
            className={`w-[90%] sm:max-w-md focus:outline-none ${
              dialogType !== "won" && dialogType !== "lost"
                ? "[&>button]:hidden"
                : ""
            }`}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader className="flex flex-col items-center justify-center gap-2">
              <DialogTitle className="text-2xl font-bold">
                {dialogContent.title}
              </DialogTitle>
              {dialogType === "won" && (
                <div className="text-center space-y-4 flex flex-col ">
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {dialogContent.description}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm whitespace-pre-line">
                    {generateShareableResult()}
                  </div>
                  <CustomizedButton onClick={startNewGame} className="mt-4">
                    Play Again
                  </CustomizedButton>
                </div>
              )}
              {dialogType === "lost" && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    {dialogContent.description}
                  </p>
                  <CustomizedButton onClick={startNewGame} className="mt-4">
                    Play Again
                  </CustomizedButton>
                </div>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Confetti isVisible={confettiOpen} />
      </div>
    </div>
  );
}
