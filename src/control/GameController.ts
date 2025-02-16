import { ChessGame, Move, PieceColour, PieceType, Position } from '@evanboerchers/chess-core';
import Piece from '../view/gameObjects/Piece';
import { Game } from '../view/scenes/Game';
import { Agent, AgentCallbacks } from './Agent';
import { ClientLocalAgent } from './ClientLocalAgent';
import BoardInputController from './BoardInputController';

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

  clearActionsOnclick() {
    this.gameScene.input.on('pointerdown', () => {
      this.clearBoardActions();
    });
  }

  setupPieceSelection(colour: PieceColour) {
    this.gameScene.board.squares.flat().forEach((square) => {
      if (
        square.piece &&
        square.piece.colour === colour
      ) {
        console.log('setting up piece selection: ', square.piece.name);
        square.setInteractive({ useHandCursor: true });
        const onClick = () => {
          console.log('piece clicked: ', square.piece?.colour, square.piece?.pieceType, square.coordinate);
          this.clearBoardActions();
          this._selectedPiece = square.coordinate;
          square.highlight();
          const potentialMoves = this.gameModel.potentialMoves(
            square.coordinate
          );
          this.setupPieceSelection(colour);
          this.setupMoves(potentialMoves.filter(move => move.capturedPiece === null || move.capturedPiece === undefined).map(move => move.to));
          this.setupCaptureMoves(potentialMoves.filter(move => move.capturedPiece !== null || move.capturedPiece !== undefined).map(move => move.to));
        };
        square.on('pointerdown', onClick);
      }
    });
  }

  clearBoardActions() {
    console.log('clearing board actions');
    this.gameScene.board.squares.flat().forEach((square) => {
      square.disableInteractive();
      square.off('pointerdown');
    });
    this.gameScene.board.clearHighlights();
  }

  handlePieceClick(piece: Piece, coordinate: Position) { }

  setupMoves(moves: Position[]) {
    moves.forEach((move) => {
      const square = this.gameScene.board.squares[move.row][move.col];
      square.setInteractive({ useHandCursor: true });
      square.highlightMove();
      const handleClick = () => {
        this.clearBoardActions();
        this.movePiece(move);
      };
      square.on('pointerdown', handleClick);
    });
  }

  setupCaptureMoves(moves: Position[]) {
    moves.forEach((move) => {
      const square = this.gameScene.board.squares[move.row][move.col];
      square.setInteractive({ useHandCursor: true });
      square.highlightCapture();
      const handleClick = () => {
        this.clearBoardActions();
        this.capturePiece(move);
      };
      square.on('pointerdown', handleClick);
    });
  }

  movePiece(to: Position) {
    console.log('moving piece from: ', this._selectedPiece, ' to: ', to);
    if (this._selectedPiece && this.gameModel.getPosition(this._selectedPiece)) {
      const piece = <Piece>this.gameModel.getPosition(this._selectedPiece)
      const move: Move = {
        //@ts-expect-error
        piece,
        from: this._selectedPiece,
        to
      }
      this.gameModel.makeMove(move);
      this.gameScene.board.movePiece(this._selectedPiece, to);
    }
  }

  capturePiece(to: Position) {
    console.log('capturing piece from: ', this._selectedPiece, ' to: ', to);
    if (this._selectedPiece && this.gameModel.getPosition(this._selectedPiece) && this.gameModel.getPosition(to)) {
      const piece = <Piece>this.gameModel.getPosition(this._selectedPiece)
      const capturedPiece = <Piece>this.gameModel.getPosition(to)
      const move: Move = {
        //@ts-expect-error
        capturedPiece,
        //@ts-expect-error
        piece,
        from: this._selectedPiece,
        to
      }
      this.gameScene.board.capturePiece(this._selectedPiece, to);
      this.gameModel.makeMove(move);
    }
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
