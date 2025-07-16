import { api } from "./api";
import { GenerateRoomResponse, JoinRoomResponse } from "@/types/room";

export const roomEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    generateRoom: builder.query<GenerateRoomResponse, void>({
      query: () => ({
        url: "/room/generate",
        method: "GET",
      }),
    }),
    joinRoom: builder.mutation<JoinRoomResponse, string>({
      query: (roomId) => ({
        url: "/room/join",
        method: "POST",
        body: { roomId },
      }),
    }),
  }),
});

export const { useGenerateRoomQuery, useJoinRoomMutation } = roomEndpoints;
