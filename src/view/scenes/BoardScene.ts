import { Scene } from 'phaser';
import Board from '../gameObjects/board/Board';
import GameController from '../../control/GameController';
import { Board as BoardData} from '@evanboerchers/chess-core'
import BoardInputController from '../../control/BoardInputController';

export default class BoardScene extends Scene {
  board: Board;
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  controller: GameController;
  boardInputController: BoardInputController

  constructor() {
    super('Board');
    this.controller = new GameController(this);
  }
  
  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor('#b88f77');
    this.createBoard(this.controller.gameModel.board);
    this.createUi();
    this.boardInputController = new BoardInputController(this.board, this.controller.gameModel)
    this.controller.startGame();
  }

  createUi() {
    this.add.text(this.scale.width - 20, 20, 'flip')
      .setOrigin(1, 0.5).on(Phaser.Input.Events.POINTER_DOWN, () => this.flipBoard())
      .setInteractive({ useHandCursor: true })
  }

  flipBoard() {
    this.board.flip()
  }

  createBoard(boardModel: BoardData) {
    const boardSize = 500;
    this.board = new Board(
      this,
      (this.scale.width * 0.75- boardSize) / 2,
      (this.scale.height - boardSize) / 2,
      boardSize,
      boardModel
    );
    this.add.existing(this.board);
  }
}
