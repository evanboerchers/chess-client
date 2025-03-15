import {
  ChessGame,
  GameState,
  Move,
  PieceColour,
} from '@evanboerchers/chess-core';
import multiplayerService from '../../service/MultiplayerService';
import BoardInputController from '../BoardInputController';
import gameController from '../GameController';
import { GameInstance } from './GameInstance.types';

export default class LocalGameInstance implements GameInstance {
  gameModel: ChessGame;
  boardInputController?: BoardInputController;

  constructor(
    boardInputController?: BoardInputController,
    gameModel?: ChessGame
  ) {
    this.gameModel = gameModel ?? new ChessGame();
    this.boardInputController = boardInputController;
    this.gameReady();
  }

  gameReady() {
    this.handleMakeMove();
  }

  handleMoveMade(move: Move, gameState: GameState) {
    console.log('handling move made');
    this.gameModel.makeMove(move);
    gameController.handleMove(move);
  }

  handleWaiting() {
    console.log('handling waiting');
  }

  handleMakeMove() {
    console.log('handling make move');
    this.boardInputController?.setupPieceSelection(
      this.gameModel.currentTurn,
      (move: Move) => {
        this.gameModel.makeMove(move);
        this.handleMakeMove();
        gameController.handleMove(move);
      }
    );
  }
}
