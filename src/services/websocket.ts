import { io, Socket } from "socket.io-client";
import {
  CreateRoomResponse,
  JoinRoomResponse,
  RoomStatus,
  GameState,
  TurnChangeEvent,
  GameOverEvent,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  ErrorEvent,
} from "@/types/room";

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  // Event callbacks
  private onConnectCallback?: () => void;
  private onDisconnectCallback?: () => void;
  private onGameStartedCallback?: (gameState: GameState) => void;
  private onTurnChangedCallback?: (event: TurnChangeEvent) => void;
  private onGuessSubmittedCallback?: (event: TurnChangeEvent) => void;
  private onGameStateUpdateCallback?: (gameState: any) => void;
  private onGameOverCallback?: (event: GameOverEvent) => void;
  private onGameRestartedCallback?: (gameState: any) => void;
  private onPlayerJoinedCallback?: (event: PlayerJoinedEvent) => void;
  private onPlayerLeftCallback?: (event: PlayerLeftEvent) => void;
  private onErrorCallback?: (event: ErrorEvent) => void;

  connect(serverUrl: string = "http://localhost:8000") {
    if (this.socket) {
      this.disconnect();
    }
    this.socket = io(serverUrl);

    this.socket.on("connect", () => {
      this.isConnected = true;
      this.onConnectCallback?.();
    });
    this.socket.on("disconnect", () => {
      this.isConnected = false;
      this.onDisconnectCallback?.();
    });
    this.socket.on("gameStarted", (gameState: GameState) => {
      this.onGameStartedCallback?.(gameState);
    });
    this.socket.on("turnChanged", (event: TurnChangeEvent) => {
      this.onTurnChangedCallback?.(event);
    });
    this.socket.on("guessSubmitted", (event: TurnChangeEvent) => {
      this.onGuessSubmittedCallback?.(event);
    });
    this.socket.on("gameStateUpdate", (gameState: any) => {
      this.onGameStateUpdateCallback?.(gameState);
    });
    this.socket.on("gameOver", (event: GameOverEvent) => {
      this.onGameOverCallback?.(event);
    });
    this.socket.on("gameRestarted", (gameState: any) => {
      this.onGameRestartedCallback?.(gameState);
    });
    this.socket.on("playerJoined", (event: PlayerJoinedEvent) => {
      this.onPlayerJoinedCallback?.(event);
    });
    this.socket.on("playerLeft", (event: PlayerLeftEvent) => {
      this.onPlayerLeftCallback?.(event);
    });
    this.socket.on("error", (event: ErrorEvent) => {
      this.onErrorCallback?.(event);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  createRoom(callback: (response: CreateRoomResponse) => void) {
    if (!this.socket) {
      callback({ success: false, roomId: "" });
      return;
    }
    this.socket.emit("createRoom", callback);
  }

  joinRoom(roomId: string, callback: (response: JoinRoomResponse) => void) {
    if (!this.socket) {
      callback({ success: false, error: "Not connected" });
      return;
    }
    this.socket.emit("joinRoom", roomId, callback);
  }

  startGame() {
    if (!this.socket) return;
    this.socket.emit("startGame");
  }

  submitGuess(guess: string) {
    if (!this.socket) return;
    this.socket.emit("submitGuess", guess);
  }

  restartGame() {
    if (!this.socket) return;
    this.socket.emit("restartGame");
  }

  getRoomStatus(callback: (response: RoomStatus) => void) {
    if (!this.socket) {
      callback({ success: false, error: "Not connected" });
      return;
    }
    this.socket.emit("getRoomStatus", callback);
  }

  // Event listeners
  onConnect(callback: () => void) {
    this.onConnectCallback = callback;
  }
  onDisconnect(callback: () => void) {
    this.onDisconnectCallback = callback;
  }
  onGameStarted(callback: (gameState: GameState) => void) {
    this.onGameStartedCallback = callback;
  }
  onTurnChanged(callback: (event: TurnChangeEvent) => void) {
    this.onTurnChangedCallback = callback;
  }
  onGuessSubmitted(callback: (event: TurnChangeEvent) => void) {
    this.onGuessSubmittedCallback = callback;
  }
  onGameStateUpdate(callback: (gameState: any) => void) {
    this.onGameStateUpdateCallback = callback;
  }
  onGameOver(callback: (event: GameOverEvent) => void) {
    this.onGameOverCallback = callback;
  }
  onGameRestarted(callback: (gameState: any) => void) {
    this.onGameRestartedCallback = callback;
  }
  onPlayerJoined(callback: (event: PlayerJoinedEvent) => void) {
    this.onPlayerJoinedCallback = callback;
  }
  onPlayerLeft(callback: (event: PlayerLeftEvent) => void) {
    this.onPlayerLeftCallback = callback;
  }
  onError(callback: (event: ErrorEvent) => void) {
    this.onErrorCallback = callback;
  }

  get connected() {
    return this.isConnected;
  }
  get socketId() {
    return this.socket?.id;
  }
}

export const websocketService = new WebSocketService();
