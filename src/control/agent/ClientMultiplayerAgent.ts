import { Move, PieceColour } from '@evanboerchers/chess-core';
import { Agent, AgentCallbacks } from './Agent.types';
import multiplayerService from '../../service/MultiplayerService';
import BoardInputController from '../BoardInputController';

export default class ClientMultiplayerAgent implements Agent {
  colour: PieceColour;
  callbacks: AgentCallbacks;
  inputController: BoardInputController;

  constructor(
    colour: PieceColour,
    callbacks: AgentCallbacks,
    inputController: BoardInputController
  ) {
    this.colour = colour;
    this.callbacks = callbacks;
    this.inputController = inputController;
  }

  waiting(): void {}

  makeMove(): void {
    this.inputController.setupPieceSelection(this.colour, (move: Move) => {
      this.callbacks.moveMade(move);
      multiplayerService.makeMove(move);
    });
  }
  drawOffered(): void {
    throw new Error('Method not implemented.');
  }
}
