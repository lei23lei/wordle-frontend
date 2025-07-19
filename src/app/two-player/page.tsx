"use client";
import { useEffect, useState } from "react";
import { websocketService } from "@/services/websocket";
import CustomizedButton from "@/components/customized-button";
import Blanks from "@/components/blanks";
import Keyboard from "@/components/keyboard";
import Confetti from "@/components/confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Copy } from "lucide-react";

type GamePhase = "lobby" | "playing" | "finished";

export default function TwoPlayerPage() {
  // Lobby state
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [inputRoomId, setInputRoomId] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Game state
  const [gamePhase, setGamePhase] = useState<GamePhase>("lobby");
  const [myGuesses, setMyGuesses] = useState<string[]>([]);
  const [opponentGuesses, setOpponentGuesses] = useState<string[]>([]);
  const [myGuessStates, setMyGuessStates] = useState<
    ("correct" | "present" | "absent")[][]
  >([]);
  const [opponentGuessStates, setOpponentGuessStates] = useState<
    ("correct" | "present" | "absent")[][]
  >([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [targetWord, setTargetWord] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);

  // Keyboard state
  const [correctKeys, setCorrectKeys] = useState<string[]>([]);
  const [presentKeys, setPresentKeys] = useState<string[]>([]);
  const [absentKeys, setAbsentKeys] = useState<string[]>([]);

  useEffect(() => {
    websocketService.connect();
    websocketService.onConnect(() => setConnected(true));
    websocketService.onDisconnect(() => setConnected(false));

    websocketService.onPlayerJoined((event) => {
      setPlayerCount(event.playerCount);
      setStatus(`Player joined`);
    });

    websocketService.onPlayerLeft((event) => {
      console.log("Player left event:", event);
      setPlayerCount(event.playerCount);
      setStatus(`Player left`);
      // Note: Backend will send gameOver event if game was in progress
    });

    websocketService.onGameStarted((gameState) => {
      console.log("Game started event received:", gameState);
      setGamePhase("playing");
      setMyGuesses(gameState.myGuesses || []);
      setMyGuessStates(gameState.myGuessStates || []);
      setOpponentGuesses([]);
      setOpponentGuessStates([]);
      setStatus("Game started!");
      console.log(
        "Game phase set to playing, initial my guesses:",
        gameState.myGuesses
      );
    });

    websocketService.onGameStateUpdate((gameState) => {
      console.log("Game state update received:", gameState);
      console.log("My guesses:", gameState.myGuesses);
      console.log("My guess states:", gameState.myGuessStates);

      // Update with authoritative server state (overwrites optimistic updates)
      setMyGuesses(gameState.myGuesses || []);
      setMyGuessStates(gameState.myGuessStates || []);

      // Update opponent state (only show states, not actual words)
      const myId = websocketService.socketId;
      const opponentId = gameState.players?.find((p: string) => p !== myId);
      if (
        opponentId &&
        gameState.playerGuessesCount &&
        gameState.playerGuessStates
      ) {
        const opponentGuessCount =
          gameState.playerGuessesCount[opponentId] || 0;
        const opponentStates = gameState.playerGuessStates[opponentId] || [];

        console.log("Opponent guess count:", opponentGuessCount);
        console.log("Opponent states:", opponentStates);

        // Create placeholder words for opponent (show only states)
        const opponentGuessesPlaceholder: string[] =
          Array(opponentGuessCount).fill("?????");
        setOpponentGuesses(opponentGuessesPlaceholder);
        setOpponentGuessStates(opponentStates);
      }

      // Update keyboard from my guesses
      if (gameState.myGuesses && gameState.myGuessStates) {
        updateKeyboardFromGuesses(gameState.myGuesses, gameState.myGuessStates);
      }
    });

    websocketService.onGameRestarted((gameState) => {
      console.log("Game restarted:", gameState);
      setGamePhase("playing");
      setGameOver(false);
      setWinner(null);
      setTargetWord("");
      setShowConfetti(false);
      setMyGuesses([]);
      setOpponentGuesses([]);
      setMyGuessStates([]);
      setOpponentGuessStates([]);
      setCurrentGuess([]);
      setCorrectKeys([]);
      setPresentKeys([]);
      setAbsentKeys([]);
      setNotificationMessage("");
      setDialogOpen(false);
      setGameOverReason(null);
      setStatus("Game restarted!");
    });

    websocketService.onGuessSubmitted((event) => {
      console.log("Guess submitted event received:", event);
      // This event is now handled by onGameStateUpdate
    });

    websocketService.onGameOver((event) => {
      console.log("Game over event:", event);
      setGamePhase("finished");
      setGameOver(true);
      setWinner(event.winner);
      setTargetWord(event.word);
      setGameOverReason(event.quitReason || null);

      // If this is a quit notification, update the dialog immediately
      if (event.quitReason === "opponent_quit") {
        setDialogOpen(true);
        return; // Don't process final guesses if opponent quit
      }

      setDialogOpen(true);

      // Update final guesses
      const myId = websocketService.socketId;
      if (myId && event.playerGuesses && event.playerGuesses[myId]) {
        setMyGuesses(event.playerGuesses[myId]);
      }

      if (event.winner === myId) {
        setStatus("🎉 You won!");
        setShowConfetti(true);
      } else if (event.winner === null) {
        setStatus("It's a tie!");
      } else {
        setStatus("😞 You lost!");
      }
    });

    websocketService.onForceReturnHome((event) => {
      console.log("Force return home:", event);
      showNotification(event.message || "Returning to home");
      // Auto-navigate to home after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    });

    websocketService.onError((event) => {
      console.log("WebSocket error received:", event);
      // Show game validation errors as notifications
      if (
        event.message.includes("Not in dictionary") ||
        event.message.includes("Invalid guess") ||
        event.message.includes("Not your turn")
      ) {
        showNotification(event.message);

        // For dictionary errors, restore the guess so user can edit it
        if (event.message.includes("Not in dictionary")) {
          // The invalid guess was already optimistically added to myGuesses,
          // we need to remove it and restore it to currentGuess
          setMyGuesses((prev) => {
            const lastGuess = prev[prev.length - 1];
            if (lastGuess) {
              setCurrentGuess(lastGuess.split(""));
            }
            return prev.slice(0, -1); // Remove the last (invalid) guess
          });
        }
      } else {
        setError(event.message);
      }
    });

    return () => websocketService.disconnect();
  }, []); // Empty dependency array to prevent re-registration

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard events when dialog is open or not in playing phase
      if (dialogOpen || gamePhase !== "playing") return;

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
  }, [gamePhase, dialogOpen, gameOver, currentGuess]);

  const showNotification = (message: string) => {
    setNotificationMessage(message);
    // Auto-clear notification after 2 seconds
    setTimeout(() => {
      setNotificationMessage("");
    }, 2000);
  };

  const updateKeyboardFromGuesses = (
    guesses: string[],
    guessStates: ("correct" | "present" | "absent")[][]
  ) => {
    const newCorrect: string[] = [];
    const newPresent: string[] = [];
    const newAbsent: string[] = [];

    guesses.forEach((guess, guessIndex) => {
      const letters = guess.split("");
      const states = guessStates[guessIndex];

      letters.forEach((letter, letterIndex) => {
        if (states[letterIndex] === "correct" && !newCorrect.includes(letter)) {
          newCorrect.push(letter);
        } else if (
          states[letterIndex] === "present" &&
          !newCorrect.includes(letter) &&
          !newPresent.includes(letter)
        ) {
          newPresent.push(letter);
        } else if (
          states[letterIndex] === "absent" &&
          !newCorrect.includes(letter) &&
          !newPresent.includes(letter) &&
          !newAbsent.includes(letter)
        ) {
          newAbsent.push(letter);
        }
      });
    });

    setCorrectKeys(newCorrect);
    setPresentKeys(newPresent);
    setAbsentKeys(newAbsent);
  };

  const handleCreateRoom = () => {
    setError(null);
    websocketService.createRoom((res) => {
      if (res.success) {
        setRoomId(res.roomId);
        setIsHost(true);
        setStatus("Room created. Waiting for another player...");
        setPlayerCount(1);
      } else {
        setError("Failed to create room");
      }
    });
  };

  const handleJoinRoom = () => {
    setError(null);
    if (!inputRoomId) {
      setError("Please enter a room ID");
      return;
    }
    websocketService.joinRoom(inputRoomId.trim().toUpperCase(), (res) => {
      if (res.success) {
        setRoomId(res.roomId!);
        setIsHost(false);
        setStatus("Joined room. Waiting for host to start the game...");
        setPlayerCount(2);
      } else {
        setError(res.error || "Failed to join room");
      }
    });
  };

  const handleStartGame = () => {
    websocketService.startGame();
  };

  const handleRestartGame = () => {
    websocketService.restartGame();
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameOver || gamePhase !== "playing") return;

    if (key === "ENTER") {
      if (currentGuess.length !== 5) {
        showNotification("Too Short");
        return;
      }
      const guessWord = currentGuess.join("");
      console.log("Submitting guess:", guessWord);

      // Optimistically add the guess to display while waiting for server response
      const newMyGuesses = [...myGuesses, guessWord];
      setMyGuesses(newMyGuesses);

      websocketService.submitGuess(guessWord);
      setCurrentGuess([]);
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key.length === 1 && currentGuess.length < 5) {
      setCurrentGuess((prev) => [...prev, key.toUpperCase()]);
    }
  };

  const getDialogContent = () => {
    const myId = websocketService.socketId;

    // Check if opponent quit
    if (gameOverReason === "opponent_quit") {
      return {
        title: "🚪 Opponent Left",
        description: `Your opponent quit the game. The word was ${targetWord}`,
        className: "text-orange-600",
      };
    }

    if (winner === myId) {
      return {
        title: "🎉 Congratulations!",
        description: `You won! The word was ${targetWord}`,
        className: "text-green-600",
      };
    } else if (winner === null) {
      return {
        title: "🤝 It's a Tie!",
        description: `Both players did their best! The word was ${targetWord}`,
        className: "text-blue-600",
      };
    } else {
      return {
        title: "😞 Game Over",
        description: `Your opponent won! The word was ${targetWord}`,
        className: "text-gray-600",
      };
    }
  };

  // Convert backend guess states to frontend format
  const convertGuessStates = (
    states: ("correct" | "present" | "absent")[][]
  ) => {
    return states.map((row) =>
      row.map((state) => state as "correct" | "present" | "absent")
    );
  };

  if (gamePhase === "lobby") {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-4 sm:py-6 h-[calc(100vh-150px)]">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-3 sm:p-4 md:p-5">
          <div className="text-center mb-3 sm:mb-4 md:mb-5">
            <h1 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-1">
              Two Player Mode
            </h1>
            <p className="text-xs sm:text-sm md:text-sm lg:text-sm text-gray-600 dark:text-gray-300">
              Challenge a friend to a WORDLE duel!
            </p>
          </div>

          {!roomId ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-3">
                <CustomizedButton
                  onClick={handleCreateRoom}
                  disabled={!connected}
                  className="w-full py-2 sm:py-2.5 text-sm sm:text-sm md:text-base lg:text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {!connected ? "Connecting..." : "Create Room"}
                </CustomizedButton>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-xs">
                    <span className="px-2 backdrop-blur-sm text-gray-500 dark:text-gray-400">
                      or join existing room
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                  <input
                    className="w-full px-3 sm:px-3 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-center text-sm sm:text-base md:text-base lg:text-base tracking-wider"
                    placeholder="ROOM ID"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value)}
                    maxLength={6}
                    style={{ textTransform: "uppercase" }}
                  />
                  <CustomizedButton
                    onClick={handleJoinRoom}
                    disabled={!connected || !inputRoomId}
                    className="w-full sm:w-32 px-3 sm:px-4 text-center py-2 sm:py-2.5 text-sm sm:text-sm md:text-base lg:text-base bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                  >
                    Join
                  </CustomizedButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-2.5 sm:p-3 md:p-3 lg:p-4 border border-blue-200 dark:border-gray-600">
                <div className="text-center space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
                      Room ID:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-base sm:text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-700 px-2 sm:px-2.5 py-1 sm:py-1.5">
                        {roomId}
                      </span>
                      <button
                        onClick={handleCopyRoomId}
                        className="p-1.5 sm:p-2 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        title="Copy Room ID"
                        type="button"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>
                  </div>

                  {copied && (
                    <div className="text-green-600 dark:text-green-400 text-xs sm:text-xs font-medium animate-pulse">
                      ✓ Copied to clipboard!
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1.5">
                    <div className="flex space-x-1">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                            i < playerCount
                              ? "bg-green-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {playerCount}/2 Players
                    </span>
                  </div>

                  <div className="text-green-600 dark:text-green-400 font-medium text-xs sm:text-xs md:text-sm">
                    {status}
                  </div>

                  {isHost && playerCount === 2 && (
                    <CustomizedButton
                      onClick={handleStartGame}
                      className="w-full py-2 sm:py-2.5 text-sm sm:text-sm md:text-base lg:text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Start Game
                    </CustomizedButton>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-2 sm:mt-3 p-1.5 sm:p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="text-red-600 dark:text-red-400 text-xs sm:text-xs font-medium text-center">
                {error}
              </div>
            </div>
          )}

          {!connected && (
            <div className="mt-2 sm:mt-3 p-1.5 sm:p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="text-yellow-600 dark:text-yellow-400 text-xs sm:text-xs font-medium text-center">
                Connecting to server...
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/"
              onClick={() => {
                if (roomId) {
                  websocketService.leaveRoom();
                }
                websocketService.disconnect();
              }}
            >
              <CustomizedButton className="w-full py-2 sm:py-2.5 text-xs sm:text-xs md:text-sm lg:text-sm text-gray-600 dark:text-gray-300  bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
                ← Return Home
              </CustomizedButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-start  gap-4">
        {/* Header */}
        <div className="text-center">
          {/* <div className="text-lg">{status}</div> */}
          {gameOver && targetWord && (
            <div className="text-lg font-semibold mt-0">
              The word was:{" "}
              <span className="font-mono text-green-600">{targetWord}</span>
            </div>
          )}
        </div>

        {/* Game Boards */}
        <div className="flex flex-row relative gap-0 md:gap-8  lg:gap-8 w-full  justify-center">
          {/* My Board */}
          <div className="flex flex-col items-center -left-14 relative md:static">
            <h2 className="text-lg font-semibold mb-2">You</h2>
            <Blanks
              guesses={(myGuesses || []).map((g) =>
                typeof g === "string" ? g.split("") : g
              )}
              currentGuess={currentGuess}
              guessStates={convertGuessStates(myGuessStates)}
              hasNotification={!!notificationMessage}
            />
            {/* Notification for my board */}
            {notificationMessage && (
              <div className="absolute -top-4 h-10 px-2 w-auto flex items-center border border-gray-300 justify-center font-bold bg-gray-50 rounded-sm shadow-md text-black z-10">
                {notificationMessage}
              </div>
            )}
          </div>

          {/* Opponent Board */}
          <div className="flex flex-col items-center scale-[0.4] -right-20 md:scale-100 absolute md:static">
            <h2 className="text-4xl md:text-lg font-semibold mb-2">Opponent</h2>
            <Blanks
              guesses={(opponentGuesses || []).map((g) =>
                typeof g === "string" ? g.split("") : g
              )}
              currentGuess={[]}
              guessStates={convertGuessStates(opponentGuessStates)}
            />
          </div>
        </div>
        {/* Play Again button - only show when game is over and opponent didn't quit */}
        {gameOver && gameOverReason !== "opponent_quit" && (
          <div className="flex flex-col items-center justify-center">
            <CustomizedButton onClick={handleRestartGame}>
              Play Again
            </CustomizedButton>
          </div>
        )}

        {/* Keyboard */}
        <div className="w-full max-w-lg">
          <Keyboard
            onKeyPress={handleKeyPress}
            correctKeys={correctKeys}
            presentKeys={presentKeys}
            absentKeys={absentKeys}
          />
        </div>

        {/* Game Over Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent
            className="w-[90%] sm:max-w-md focus:outline-none"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader className="flex flex-col items-center justify-center gap-2">
              <DialogTitle className="text-2xl font-bold">
                {getDialogContent().title}
              </DialogTitle>
              <div className="text-center space-y-4 flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  {getDialogContent().description}
                </p>
                <div className="flex flex-col gap-2">
                  {gameOverReason !== "opponent_quit" && (
                    <CustomizedButton onClick={handleRestartGame}>
                      Play Again
                    </CustomizedButton>
                  )}

                  <Link
                    href="/"
                    onClick={() => {
                      websocketService.leaveRoom();
                      websocketService.disconnect();
                    }}
                  >
                    <CustomizedButton>Return Home</CustomizedButton>
                  </Link>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Confetti isVisible={showConfetti} />
      </div>
    </div>
  );
}
