import {
  ChessGame,
  GameState,
  Move,
  PieceColour,
} from '@evanboerchers/chess-core';
import BoardScene from '../view/scenes/BoardScene';
import { Agent } from './agent/Agent.types';
import GameSidebarScene from '../view/scenes/sidebar/GameSidebarScene';
import { GameInstance } from './instance/GameInstance.types';
import MultiplayerGameInstance from './instance/MultiplayerGameInstance';
import LocalGameInstance from './instance/LocalGameInstance';
import BoardInputController from './BoardInputController';

export class GameController {
  boardScene: BoardScene;
  gameSidebarScene: GameSidebarScene;
  gameInstance: GameInstance;
  whiteAgent: Agent;
  blackAgent: Agent;
  _currentPlayer: Agent;

  constructor() {
    this.gameInstance = new LocalGameInstance();
  }

  setBoardScene(boardScene: BoardScene) {
    this.boardScene = boardScene;
  }

  setGameSidebarScene(gameSidebarScene: GameSidebarScene) {
    this.gameSidebarScene = gameSidebarScene;
  }

  setupMultiplayerGame(playerColour: PieceColour, gameState: GameState) {
    console.log('setting up multiplayer game');
    const model = new ChessGame(gameState);
    const inputController = new BoardInputController(
      this.boardScene.board,
      model
    );
    this.gameInstance = new MultiplayerGameInstance(
      inputController,
      model,
      playerColour
    );
    if (playerColour === PieceColour.BLACK) this.flipBoard();
  }

  setupLocalGame() {
    console.log('setting up local game');
    const model = new ChessGame();
    const inputController = new BoardInputController(
      this.boardScene.board,
      model
    );
    this.gameInstance = new LocalGameInstance(inputController, model);
  }

  handleMove(move: Move) {
    this.redrawBoard();
  }

  handleResign(colour: PieceColour) {}

  handleDrawOffer(colour: PieceColour) {}

  handleDrawAccepted() {}

  handleDrawDeclined() {}

  handleGameReady() {
    this.whiteAgent.makeMove();
    this.blackAgent.waiting();
  }

  clearBoardHighlights() {
    this.boardScene.board.clearHighlights();
  }

  redrawBoard() {
    this.boardScene.board.clearBoard();
    this.boardScene.board.drawPieces(this.gameInstance.gameModel.board);
    const previousMove = this.gameInstance.gameModel.moveHistory[0]
    if (previousMove) {
      this.boardScene.board.highlightPreviousMoveSquare(previousMove.from)
      this.boardScene.board.highlightPreviousMoveSquare(previousMove.to)
    }
  }

  flipBoard() {
    this.boardScene.flipBoard();
    this.gameSidebarScene.flip();
  }
}

const gameController = new GameController();
export default gameController;
