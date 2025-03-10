import { PieceColour } from '@evanboerchers/chess-core';
import { Agent, AgentCallbacks } from './Agent.types';
import BoardInputController from '../BoardInputController';

export default class ClientLocalAgent implements Agent {
  callbacks: AgentCallbacks;
  colour: PieceColour;
  inputController: BoardInputController;

  constructor(
    colour: PieceColour,
    callbacks: AgentCallbacks,
    inputController: BoardInputController
  ) {
    this.callbacks = callbacks;
    this.colour = colour;
    this.inputController = inputController;
  }

  waiting(): void {}
  makeMove(): void {
    this.inputController.setupPieceSelection(
      this.colour,
      this.callbacks.moveMade
    );
  }
  drawOffered(): void {
    throw new Error('Method not implemented.');
  }
}
