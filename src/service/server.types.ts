import {
  GameOutcome,
  GameState,
  Move,
  PieceColour,
} from '@evanboerchers/chess-core';
import { Socket } from "socket.io-client";

export interface ServerToClientEvents {
  queueJoined: () => void;
  leftQueue: () => void;
  queueCount: (count: number) => void;
  gameFound: (
    playerColour: PieceColour,
    opponentData: PlayerData,
    state: GameState
  ) => void;
  makeMove: () => void;
  waiting: () => void;
  moveMade: (move: Move, state: GameState) => void;
  drawOffered: () => void;
  gameOver: (result: GameOutcome) => void;
  drawDeclined: () => void;
}

export interface ClientToServerEvents {
  joinQueue: (playerData: PlayerData) => void;
  leaveQueue: () => void;
  gameReady: () => void;
  makeMove: (move: Move) => void;
  resign: () => void;
  offerDraw: () => void;
  drawAccepted: () => void;
  drawDeclined: () => void;
}

export interface PlayerData {
  name: string;
  icon: string;
}

export type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
