export interface Player {
  id: string;
  roomId: string;
  isHost: boolean;
}

export interface Room {
  id: string;
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
