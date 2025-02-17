import { Scene } from 'phaser';
import Board from '../gameObjects/Board';
import GameController from '../../control/GameController';
import { Board as BoardData} from '@evanboerchers/chess-core'
import BoardInputController from '../../control/BoardInputController';
import PlayerPanel from '../gameObjects/PlayerPanel';

export class Game extends Scene {
  board: Board;
  whitePanel: PlayerPanel;
  blackPanel: PlayerPanel;
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  controller: GameController;
  boardInputController: BoardInputController

  constructor() {
    super('Game');
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
      this.whitePanel = new PlayerPanel(this, 770, 550, "whitePlayer", "King")
      this.add.existing(this.whitePanel)
      this.blackPanel = new PlayerPanel(this, 770, 150, "blackPlayer", "King")
      this.add.existing(this.blackPanel)
  }

  flipBoard() {
    this.board.flip()
  }

  createBoard(boardModel: BoardData) {
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
