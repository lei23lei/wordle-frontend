"use client";
import { useEffect, useState } from "react";
import { websocketService } from "@/services/websocket";
import CustomizedButton from "@/components/customized-button";
import Link from "next/link";
import { Copy } from "lucide-react";

export default function TwoPlayerPage() {
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [inputRoomId, setInputRoomId] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    websocketService.connect();
    websocketService.onConnect(() => setConnected(true));
    websocketService.onDisconnect(() => setConnected(false));
    websocketService.onPlayerJoined((event) => {
      setPlayerCount(event.playerCount);
      setStatus(`Player joined: ${event.playerId}`);
    });
    websocketService.onPlayerLeft((event) => {
      setPlayerCount(event.playerCount);
      setStatus(`Player left: ${event.playerId}`);
    });
    websocketService.onError((event) => setError(event.message));
    return () => websocketService.disconnect();
  }, []);

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
        setPlayerCount(2); // Assume 2 after join
      } else {
        setError(res.error || "Failed to join room");
      }
    });
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

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
        </div>
      )}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {!connected && (
        <div className="text-gray-400">Connecting to server...</div>
      )}
      <div className="mt-8">
        <Link href="/">
          <CustomizedButton>Return Home</CustomizedButton>
        </Link>
      </div>
    </div>
  );
}
