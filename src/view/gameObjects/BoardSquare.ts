import { Scene } from 'phaser';
import Piece from './Piece';
import ThemeManager from '../ThemeManager';

export default class BoardSquare extends Phaser.GameObjects.Container {
  public background: Phaser.GameObjects.Rectangle;
  public _piece?: Piece;
  public row: number;
  public col: number;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    color: number,
    row: number,
    col: number,
    piece?: Piece
  ) {
    super(scene, x, y);
    this.background = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      width,
      width,
      color
    );
    this.add(this.background);
    this._piece = piece;
    this.width = width;
    this.height = width;
    this.row = row;
    this.col = col;
  }

  public addPiece(piece: Piece) {
    this._piece = piece;
    this._piece.setDisplaySize(this.width, this.height);
    this.add(this._piece);
  }

  get piece(): Piece | undefined {
    return this._piece;
  }

  public highlight() {
    this.background.setFillStyle(ThemeManager.getTheme().board.highlightColour);
  }

  public highlightAttack() {
    this.background.setFillStyle(ThemeManager.getTheme().board.attackColour);
  }

  public highlightMove() {
    this.background.setFillStyle(ThemeManager.getTheme().board.moveColour);
  }
}
