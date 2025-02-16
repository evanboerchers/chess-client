import { ChessGame, Move, PieceColour, PieceType, Position } from '@evanboerchers/chess-core';
import { Game } from '../view/scenes/Game';
import { Agent, AgentCallbacks } from './agent/Agent.types';
import ClientLocalAgent  from './agent/ClientLocalAgent';

export default class GameController {
  gameScene: Game;
  gameModel: ChessGame;
  whiteAgent: Agent;
  blackAgent: Agent;
  _currentPlayer: Agent;
  _selectedPiece: Position | null = null;

  constructor(gameScene: Game) {
    this.gameScene = gameScene;
    this.gameModel = new ChessGame();
  }

  handleMove(move: Move) {
    this.gameModel.makeMove(move);
    this.redrawBoard();
    this.changeTurn();
  }

  handleResign(colour: PieceColour) {

  }

  handleDrawOffer(colour: PieceColour) {
    
  }

  handleDrawAccepted() {

  }

  handleDrawDeclined() {

  }

  createAgents() {
    const whiteCallbacks: AgentCallbacks = {
      moveMade: (move: Move) => this.handleMove(move),
      resign: () => this.handleResign(PieceColour.WHITE),
      offerDraw: () => this.handleDrawOffer(PieceColour.WHITE),
      drawAccepted: () => this.handleDrawAccepted(),
      drawDeclined: () => this.handleDrawDeclined(),
    }
    this.whiteAgent = new ClientLocalAgent(whiteCallbacks, PieceColour.WHITE, this.gameScene.boardInputController);
    const blackCallbacks: AgentCallbacks = {
        moveMade: (move: Move) => this.handleMove(move),
        resign: () => this.handleResign(PieceColour.WHITE),
        offerDraw: () => this.handleDrawOffer(PieceColour.WHITE),
        drawAccepted: () => this.handleDrawAccepted(),
        drawDeclined: () => this.handleDrawDeclined(),
    }
    this.blackAgent = new ClientLocalAgent(blackCallbacks, PieceColour.BLACK, this.gameScene.boardInputController);
  }

  startGame() {
    this.createAgents();
    this._currentPlayer = this.whiteAgent;
    this.setupWhiteTurn();
  }

  clearBoardHighlights() {  
    this.gameScene.board.clearHighlights();
  }

  setupWhiteTurn() {
    this._currentPlayer = this.whiteAgent;
    this.whiteAgent.makeMove();
    this.blackAgent.waiting();
    console.log('setting up white turn');
    }

  setupBlackTurn() {
    this._currentPlayer = this.blackAgent
    this.blackAgent.makeMove();
    this.whiteAgent.waiting();
    console.log('setting up black turn');
  }

  redrawBoard() {
    this.gameScene.board.clearBoard();
    this.gameScene.board.drawPieces(this.gameModel.board);
  }

  changeTurn() {
    if (this._currentPlayer.colour === PieceColour.WHITE) {
      this.setupBlackTurn();
    } else {
      this.setupWhiteTurn();
    }
  }
}
