import { PieceColour } from '@evanboerchers/chess-core';
import { Agent, AgentCallbacks } from './Agent.types';

export default class ClientMultiplayerAgent implements Agent {
  colour: PieceColour;
  callbacks: AgentCallbacks;

  constructor(colour: PieceColour, callbacks: AgentCallbacks) {
    this.colour = colour;
    this.callbacks = callbacks;
  }

  waiting(): void {
    throw new Error('Method not implemented.');
  }
  makeMove(): void {
    throw new Error('Method not implemented.');
  }
  drawOffered(): void {
    throw new Error('Method not implemented.');
  }
}
