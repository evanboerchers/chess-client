import { GameOutcome, GameState, Move } from "@evanboerchers/chess-core";
import { Socket } from "socket.io-client";

export interface ServerToClientEvents {
    queueJoined: () => void;
    gameStarted: (state: GameState) => void;
    makeMove: () => void;
    waiting: () => void;
    moveMade: (move: Move, state: GameState) => void; 
    drawOffered: () => void;
    gameOver: (result: GameOutcome) => void;
    drawDeclined: () => void;
  }
  
export interface ClientToServerEvents {
    joinQueue: (playerName: string) => void;
    makeMove: (move: Move) => void;
    resign: () => void;
    offerDraw: () => void;
    drawAccepted: () => void;
    drawDeclined: () => void;
}

export type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>