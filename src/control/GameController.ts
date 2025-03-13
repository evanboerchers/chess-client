import {
  ChessGame,
  GameState,
  Move,
  PieceColour,
} from '@evanboerchers/chess-core';
import BoardScene from '../view/scenes/BoardScene';
import { Agent, AgentCallbacks } from './agent/Agent.types';
import ClientLocalAgent from './agent/ClientLocalAgent';
import GameSidebarScene from '../view/scenes/sidebar/GameSidebarScene';
import ClientMultiplayerAgent from './agent/ClientMultiplayerAgent';
import { GameInstance } from './GameInstance.types';
import MultiplayerGameInstance from './MultiplayerGameInstance';
import LocalGameInstance from './LocalGameInstance';

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
    this.boardScene = boardScene
  }

  setGameSidebarScene(gameSidebarScene: GameSidebarScene) {
    this.gameSidebarScene = gameSidebarScene
  }

  setupMultiplayerGame(playerColour: PieceColour, gameState: GameState) {
    this.gameInstance = new MultiplayerGameInstance(
      this.boardScene.boardInputController, 
      new ChessGame(gameState), 
      playerColour)
  }

  handleMove(move: Move) {
    this.redrawBoard();
  }

  handleResign(colour: PieceColour) {}

  handleDrawOffer(colour: PieceColour) {}

  handleDrawAccepted() {}

  handleDrawDeclined() {}

  handleGameReady() {
    this.whiteAgent.makeMove()
    this.blackAgent.waiting()
  }

  clearBoardHighlights() {
    this.boardScene.board.clearHighlights();
  }

  redrawBoard() {
    this.boardScene.board.clearBoard();
    this.boardScene.board.drawPieces(this.gameInstance.gameModel.board);
  }

  flipBoard() {
    this.boardScene.flipBoard();
    this.gameSidebarScene.flip();
  }
}

const gameController = new GameController()
export default gameController