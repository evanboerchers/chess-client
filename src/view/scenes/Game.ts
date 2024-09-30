import { Scene } from 'phaser';
import { GameModel } from '../../model/gameModel';
import { BoardCoordinate } from '../../model/board/board.types';
import Board from '../gameObjects/Board';
import { PieceColour } from '../../model/board/pieces/pieces.types';

const gameEvents = new Phaser.Events.EventEmitter();

enum GameState {
  WhiteTurn,
  BlackTurn,
  WhiteWin,
  BlackWin,
  Draw,
}

export class Game extends Scene {
  board: Board;
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameModel: GameModel;
  _selectedPiece: BoardCoordinate | null = null;

  constructor() {
    super('Game');
    this.gameModel = new GameModel();
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor('#b88f77');
    this.addBoard();
    this.whiteTurn();
  }

  addBoard() {
    const boardSize = 500;
    this.board = new Board(
      this,
      (this.scale.width - boardSize) / 2,
      (this.scale.height - boardSize) / 2,
      boardSize,
      this.gameModel.boardModel
    );
    this.add.existing(this.board);
  }

  handlePieceSelect(coordinate: BoardCoordinate) {
    this.selectedPiece = coordinate;
    this.board.highlightSquare(this.selectedPiece);

    const potentialMoves = this.getPotentialMoves(coordinate);
    console.log(potentialMoves);
    potentialMoves.moves.forEach((move) => {
      this.board.highlightMoveSquare(move);
    });
    potentialMoves.captures.forEach((capture) => {
      this.board.highlightCaptureSquare(capture);
    });
  }

  getPotentialMoves(coordinate: BoardCoordinate) {
    return this.gameModel.boardModel.getPotentialMoves(coordinate);
  }

  whiteTurn() {
    this.board.disableInteractive();
    this.board.enablePieceInteractions(
      PieceColour.White,
      this.handlePieceSelect.bind(this)
    );
  }

  blackTurn() {
    this.board.enablePieceInteractions(
      PieceColour.Black,
      this.handlePieceSelect.bind(this)
    );
  }

  get selectedPiece() {
    return this._selectedPiece;
  }

  set selectedPiece(coordinate: BoardCoordinate | null) {
    console.log('selected piece', coordinate);
    this._selectedPiece = coordinate;
  }
}
