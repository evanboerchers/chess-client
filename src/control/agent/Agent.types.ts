import { Move, PieceColour } from '@evanboerchers/chess-core';

export interface AgentCallbacks {
  moveMade: (move: Move) => void;
  resign: () => void;
  offerDraw: () => void;
  drawAccepted: () => void;
  drawDeclined: () => void;
}

export interface Agent {
  colour: PieceColour;
  callbacks: AgentCallbacks;
  waiting(): void;
  makeMove(): void;
  drawOffered(): void;
}
