import { Move, PieceColour } from '@evanboerchers/chess-core';
import { Agent, AgentCallbacks } from './Agent.types';
import multiplayerService from '../../service/MultiplayerService';

export default class ServerMultiplayerAgent implements Agent {
  colour: PieceColour;
  callbacks: AgentCallbacks;

  constructor(colour: PieceColour, callbacks: AgentCallbacks) {
    this.colour = colour;
    this.callbacks = callbacks;
  }

  registerEvents() {
  }
  
  waiting(): void {
  }
  
  makeMove(): void {
    const callback = (move: Move) => {
      this.callbacks.moveMade(move)
      multiplayerService.off('moveMade', this.callbacks.moveMade)
    }
    multiplayerService.on('moveMade', callback)
  }

  drawOffered(): void {
    throw new Error('Method not implemented.');
  }
}
