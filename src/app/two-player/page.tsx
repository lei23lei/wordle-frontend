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
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [myGuesses, setMyGuesses] = useState<string[]>([]);
  const [opponentGuesses, setOpponentGuesses] = useState<string[]>([]);
  const [myGuessStates, setMyGuessStates] = useState<
    ("correct" | "present" | "absent")[][]
  >([]);
  const [opponentGuessStates, setOpponentGuessStates] = useState<
    ("correct" | "present" | "absent")[][]
  >([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
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
      setPlayers(gameState.players);
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

      setPlayers((currentPlayers) => {
        const opponentId = currentPlayers.find((p) => p !== myId);
        if (
          opponentId &&
          event.playerGuesses &&
          event.playerGuesses[opponentId]
        ) {
          setOpponentGuesses(event.playerGuesses[opponentId]);
        }

        if (myId && event.playerGuessStates && event.playerGuessStates[myId]) {
          setMyGuessStates(event.playerGuessStates[myId]);
        }

        if (
          opponentId &&
          event.playerGuessStates &&
          event.playerGuessStates[opponentId]
        ) {
          setOpponentGuessStates(event.playerGuessStates[opponentId]);
        }

        return currentPlayers;
      });

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

  const resetGame = () => {
    setGamePhase("lobby");
    setRoomId("");
    setInputRoomId("");
    setPlayerCount(0);
    setIsHost(false);
    setStatus(null);
    setError(null);
    setCurrentTurn(null);
    setPlayers([]);
    setMyGuesses([]);
    setOpponentGuesses([]);
    setMyGuessStates([]);
    setOpponentGuessStates([]);
    setCurrentGuess([]);
    setIsMyTurn(false);
    setGameOver(false);
    setWinner(null);
    setTargetWord("");
    setShowConfetti(false);
    setCorrectKeys([]);
    setPresentKeys([]);
    setAbsentKeys([]);
    setNotificationMessage("");
    setDialogOpen(false);
    setGameOverReason(null);
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

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
        <h1 className="text-4xl font-bold mb-4 text-center">Two Player Mode</h1>
        <div className="mb-6 flex flex-col gap-4 w-full max-w-xs">
          <CustomizedButton
            onClick={handleCreateRoom}
            disabled={!connected || !!roomId}
          >
            Create Room
          </CustomizedButton>
          <div className="flex gap-2">
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="Enter Room ID"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              disabled={!!roomId}
              maxLength={6}
              style={{ textTransform: "uppercase" }}
            />
            <CustomizedButton
              onClick={handleJoinRoom}
              disabled={!connected || !!roomId}
            >
              Join
            </CustomizedButton>
          </div>
        </div>
        {roomId && (
          <div className="mb-4 text-center">
            <div className="text-lg font-semibold flex items-center justify-center gap-2">
              Room ID: <span className="font-mono">{roomId}</span>
              <button
                onClick={handleCopyRoomId}
                className="ml-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                title="Copy Room ID"
                type="button"
              >
                <Copy className="w-5 h-5" />
              </button>
              {copied && (
                <span className="text-green-500 text-sm ml-2">Copied!</span>
              )}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Players: {playerCount}/2
            </div>
            <div className="text-green-600 mt-2">{status}</div>
            {isHost && playerCount === 2 && (
              <CustomizedButton onClick={handleStartGame} className="mt-4">
                Start Game
              </CustomizedButton>
            )}
          </div>
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {!connected && (
          <div className="text-gray-400">Connecting to server...</div>
        )}
        <div className="mt-8">
          <Link
            href="/"
            onClick={() => {
              if (roomId) {
                websocketService.leaveRoom();
              }
              websocketService.disconnect();
            }}
          >
            <CustomizedButton>Return Home</CustomizedButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-start min-h-screen gap-4">
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
