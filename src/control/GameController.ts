import {
  ChessGame,
  Move,
  PieceColour,
  PieceType,
  Position,
} from '@evanboerchers/chess-core';
import BoardScene from '../view/scenes/BoardScene';
import { Agent, AgentCallbacks } from './agent/Agent.types';
import ClientLocalAgent from './agent/ClientLocalAgent';
import GameSidebarScene from '../view/scenes/sidebar/GameSidebarScene';
import SidebarScene from '../view/scenes/sidebar/SidebarScene';
import Piece from '../view/gameObjects/board/Piece';
import ClientMultiplayerAgent from './agent/ClientMultiplayerAgent';

export class GameController {
  boardScene: BoardScene;
  gameSidebarScene: GameSidebarScene;
  gameModel: ChessGame;
  whiteAgent: Agent;
  blackAgent: Agent;
  _currentPlayer: Agent;
  _selectedPiece: Position | null = null;

  constructor() {
    this.gameModel = new ChessGame();
  }

  setBoardScene(boardScene: BoardScene) {
    this.boardScene = boardScene
  }

  setGameSidebarScene(gameSidebarScene: GameSidebarScene) {
    this.gameSidebarScene = gameSidebarScene
  }

  handleMove(move: Move) {
    this.gameModel.makeMove(move);
    this.redrawBoard();
    this.changeTurn();
  }

  handleResign(colour: PieceColour) {}

  handleDrawOffer(colour: PieceColour) {}

  handleDrawAccepted() {}

  handleDrawDeclined() {}

  createLocalAgent(colour: PieceColour) {
    const callbacks: AgentCallbacks = {
      moveMade: (move: Move) => this.handleMove(move),
      resign: () => this.handleResign(colour),
      offerDraw: () => this.handleDrawOffer(colour),
      drawAccepted: () => this.handleDrawAccepted(),
      drawDeclined: () => this.handleDrawDeclined(),
    };
    return new ClientLocalAgent(
      colour,
      callbacks,
      this.boardScene.boardInputController
    );
  }

  createClientMultiplayerAgent(colour: PieceColour) {
    const callbacks: AgentCallbacks = {
      moveMade: (move: Move) => this.handleMove(move),
      resign: () => this.handleResign(colour),
      offerDraw: () => this.handleDrawOffer(colour),
      drawAccepted: () => this.handleDrawAccepted(),
      drawDeclined: () => this.handleDrawDeclined(),
    };
    return new ClientLocalAgent(
      colour,
      callbacks,
      this.boardScene.boardInputController
    );
  }

  createServerMultiplayerAgent(colour: PieceColour) {
    const callbacks: AgentCallbacks = {
      moveMade: (move: Move) => this.handleMove(move),
      resign: () => this.handleResign(colour),
      offerDraw: () => this.handleDrawOffer(colour),
      drawAccepted: () => this.handleDrawAccepted(),
      drawDeclined: () => this.handleDrawDeclined(),
    };
    return new ClientMultiplayerAgent(
      colour,
      callbacks,
      this.boardScene.boardInputController
    );
  }

  setupLocalGame() {
    this.blackAgent = this.createLocalAgent(PieceColour.BLACK)
    this.whiteAgent = this.createLocalAgent(PieceColour.WHITE)
    this.setupWhiteTurn();
    this._currentPlayer = this.whiteAgent;
  }

  setupMultiplayerGame(playerColour: PieceColour) {
    if (playerColour === PieceColour.WHITE) {
      this.whiteAgent = this.createClientMultiplayerAgent(PieceColour.WHITE)
      this.blackAgent = this.createServerMultiplayerAgent(PieceColour.BLACK)
    } else {
      this.whiteAgent = this.createServerMultiplayerAgent(PieceColour.WHITE)
      this.blackAgent = this.createClientMultiplayerAgent(PieceColour.BLACK)
    }
  }

  handleGameReady() {
    this.whiteAgent.makeMove()
    this.blackAgent.waiting()
  }

  clearBoardHighlights() {
    this.boardScene.board.clearHighlights();
  }

  setupWhiteTurn() {
    this._currentPlayer = this.whiteAgent;
    this.whiteAgent.makeMove();
    this.blackAgent.waiting();
    console.log('setting up white turn');
  }

  setupBlackTurn() {
    this._currentPlayer = this.blackAgent;
    this.blackAgent.makeMove();
    this.whiteAgent.waiting();
    console.log('setting up black turn');
  }

  redrawBoard() {
    this.boardScene.board.clearBoard();
    this.boardScene.board.drawPieces(this.gameModel.board);
  }

  changeTurn() {
    if (this._currentPlayer.colour === PieceColour.WHITE) {
      this.setupBlackTurn();
    } else {
      this.setupWhiteTurn();
    }
  }

  flipBoard() {
    this.boardScene.flipBoard();
    this.gameSidebarScene.flip();
  }
}

const gameController = new GameController()
export default gameController