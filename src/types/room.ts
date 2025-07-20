export interface Player {
  id: string;
  roomId: string; // 6-digit string room ID
  isHost: boolean;
}

export interface Room {
  id: string; // 6-digit string room ID
  players: string;
  word: string;
  gameStarted: boolean;
  currentTurn: string | null;
  playerGuesses: Record<string, string[]>;
  gameOver: boolean;
  winner: string | null;
}

export interface RoomStatus {
  success: boolean;
  room?: Room;
  error?: string;
}

export interface CreateRoomResponse {
  success: boolean;
  roomId: string;
}

export interface JoinRoomResponse {
  success: boolean;
  roomId?: string;
  error?: string;
}

export interface GameState {
  gameStarted: boolean;
  gameOver: boolean;
  winner: string | null;
  word?: string;
  players: string[];
  playerGuessStates: Record<string, ("correct" | "present" | "absent")[][]>;
  playerGuessesCount: Record<string, number>;
  myGuesses: string[];
  myGuessStates: ("correct" | "present" | "absent")[][];
  playerGuesses?: Record<string, string[]>;
  quitReason?: string;
}

// GameStateUpdate and GameRestartEvent are the same as GameState
// Using type aliases instead of empty interfaces
export type GameStateUpdate = GameState;
export type GameRestartEvent = GameState;

export interface ForceReturnHomeEvent {
  message: string;
}

export interface TurnChangeEvent {
  currentTurn: string;
  playerGuesses: Record<string, string[]>;
  playerGuessStates: Record<string, ("correct" | "present" | "absent")[][]>;
}

export interface GameOverEvent {
  winner: string | null;
  word: string;
  playerGuesses: Record<string, string[]>;
  playerGuessStates: Record<string, ("correct" | "present" | "absent")[][]>;
  quitReason?: string;
}

export interface PlayerJoinedEvent {
  playerId: string;
  playerCount: number;
}

export interface PlayerLeftEvent {
  playerId: string;
  playerCount: number;
}

export interface ErrorEvent {
  message: string;
}
