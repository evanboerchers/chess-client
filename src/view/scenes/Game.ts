import { Scene } from 'phaser';
import { GameModel } from '../../model/gameModel';
import { BoardCoordinate } from '../../model/board/board.types';
import Board from '../gameObjects/Board';
import { PieceColour } from '../../model/board/pieces/pieces.types';
import BoardSquare from '../gameObjects/BoardSquare';
import Piece from '../gameObjects/Piece';
import { PotentialMoves } from '../../model/board/pieces/movement/movement.types';
import GameController from '../../control/GameController';
import { BoardModel } from '../../model/board/boardModel';

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
  controller: GameController;

  currentPlayer: PieceColour = PieceColour.White;
  potentialMoves: PotentialMoves | null = null;
  _selectedPiece: BoardCoordinate | null = null;
  _inputHandler: Function;

  constructor() {
    super('Game');
    this.controller = new GameController(this);
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor('#b88f77');
    this.addBoard(this.controller.gameModel.boardModel);
    this.controller.startGame();
  }

  addBoard(boardModel: BoardModel) {
    const boardSize = 500;
    this.board = new Board(
      this,
      (this.scale.width - boardSize) / 2,
      (this.scale.height - boardSize) / 2,
      boardSize,
      boardModel
    );
    this.add.existing(this.board);
  }
}
