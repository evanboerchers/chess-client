import { Scene } from 'phaser';
import Board from '../gameObjects/board/Board';
import { Board as BoardData } from '@evanboerchers/chess-core';
import BoardInputController from '../../control/BoardInputController';
import { SceneNames } from './scenes.enum';
import gameController from '../../control/GameController';

export default class BoardScene extends Scene {
  board: Board;
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;

  constructor() {
    super(SceneNames.BOARD);
  }

  init() {
    gameController.setBoardScene(this);
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor('#b88f77');
    this.createBoard(gameController.gameInstance.gameModel.board);
    this.createUi();
  }

  createUi() {
    this.add
      .text(this.scale.width - 20, 20, 'flip')
      .setOrigin(1, 0.5)
      .on(Phaser.Input.Events.POINTER_DOWN, () => this.flipBoard())
      .setInteractive({ useHandCursor: true });
  }

  flipBoard() {
    this.board.flip();
  }

  createBoard(boardModel: BoardData) {
    const boardSize = 700;
    this.board = new Board(
      this,
      (this.scale.width * 0.75 - boardSize) / 2,
      (this.scale.height - boardSize) / 2,
      boardSize,
      boardModel
    );
    this.add.existing(this.board);
  }
}
