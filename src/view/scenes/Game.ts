import { Scene } from 'phaser';
import Board from '../gameObjects/Board';
import { Move, PieceColour, Position } from '@evanboerchers/chess-core';
import GameController from '../../control/GameController';
import { Board as BoardData} from '@evanboerchers/chess-core'

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

  currentPlayer: PieceColour = PieceColour.WHITE;
  potentialMoves: Move[] | null = null;
  _selectedPiece: Position | null = null;
  _inputHandler: Function;

  constructor() {
    super('Game');
    this.controller = new GameController(this);
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor('#b88f77');
    this.createBoard(this.controller.gameModel.board);
    this.createUi();
    this.controller.startGame();
  }

  createUi() {
    this.add.text(this.scale.width - 20, 20, 'flip')
      .setOrigin(1, 0.5).on(Phaser.Input.Events.POINTER_DOWN, () => this.flipBoard)
      .setInteractive({ useHandCursor: true })
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
