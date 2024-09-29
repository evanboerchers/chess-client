import { Scene } from 'phaser';
import Board from '../gameObjects/Board';
import { GameModel } from '../../model/gameModel';
import { PieceColour } from '../../model/board/entities/pieces';

const gameEvents = new Phaser.Events.EventEmitter();

export class Game extends Scene {
  board: Board;
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  gameModel: GameModel;

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

  whiteTurn() {
    this.board.enablePieceInteractions(PieceColour.White);
  }

  blackTurn() {
    this.board.enablePieceInteractions(PieceColour.Black);
  }
}
