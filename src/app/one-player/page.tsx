"use client";

import Blanks from "@/components/blanks";
import Keyboard from "@/components/keyboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VALID_WORDS } from "@/data/words";
import { useState, useEffect } from "react";

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
  const [message, setMessage] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);

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
    setMessage("");
    setCorrectKeys([]);
    setPresentKeys([]);
    setAbsentKeys([]);
    setIsValidating(false);
    setDialogOpen(false);
    setDialogType(null);
  };

  const showDialog = (type: DialogType, msg: string) => {
    setDialogType(type);
    setMessage(msg);
    setDialogOpen(true);

    // Auto-close after 3 seconds for non-game-end dialogs
    if (type !== "won" && type !== "lost") {
      setTimeout(() => {
        setDialogOpen(false);
      }, 1000);
    }
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
    } catch (error) {
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
        targetArray[i] = null as any; // Mark as used
        guessArray[i] = null as any; // Mark as used
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
      if (guessArray[i] !== null) {
        const targetIndex = targetArray.indexOf(guessArray[i]);
        if (targetIndex !== -1) {
          result[i] = "present";
          targetArray[targetIndex] = null as any; // Mark as used
        } else {
          result[i] = "absent";
        }
      }
    }

    return result;
  };

  const updateKeyboardState = (
    guess: string[],
    evaluation: ("correct" | "present" | "absent")[]
  ) => {
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
  };

  const submitGuess = async () => {
    if (currentGuess.length !== 5) {
      showDialog("short", "Word must be 5 letters!");
      return;
    }

    setIsValidating(true);

    // Validate the word
    const isValid = await isValidWord(currentGuess);

    if (!isValid) {
      setIsValidating(false);
      showDialog("invalid", "Word not in dictionary!");
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
      showDialog(
        "won",
        `🎉 Congratulations! You won! The word was ${targetWord}`
      );
    } else if (newGuesses.length >= 6) {
      setGameState("lost");
      showDialog("lost", `😞 Game Over! You lost! The word was ${targetWord}`);
    }

    setCurrentGuess([]);
  };

  const handleKeyPress = (key: string) => {
    if (gameState !== "playing" || isValidating) return;

    if (key === "ENTER") {
      submitGuess();
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key.length === 1 && currentGuess.length < 5) {
      setCurrentGuess((prev) => [...prev, key.toUpperCase()]);
    }
  };

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
  }, [currentGuess, gameState, isValidating, dialogOpen]);

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
      case "invalid":
        return {
          title: "Not in Dictionary",
          className: "",
        };
      case "short":
        return {
          title: "Too Short",
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

  const dialogContent = getDialogContent();

  return (
    <div className="container mx-auto">
      <div>{targetWord}</div>
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 py-8">
        <Blanks
          guesses={guesses}
          currentGuess={currentGuess}
          guessStates={guessStates}
        />

        <Keyboard
          onKeyPress={handleKeyPress}
          correctKeys={correctKeys}
          presentKeys={presentKeys}
          absentKeys={absentKeys}
        />

        {gameState !== "playing" && (
          <Button onClick={startNewGame} className="mt-4">
            Play Again
          </Button>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent
            className={`sm:max-w-md focus:outline-none ${
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
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
