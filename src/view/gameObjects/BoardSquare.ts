import { Scene } from "phaser";
import Piece from "./Piece";

export default class BoardSquare extends Phaser.GameObjects.Container {
  public background: Phaser.GameObjects.Rectangle;
  public _piece?: Piece;
  constructor(scene: Scene, x: number, y: number, width: number, color: number, piece?: Piece) {
    super(scene, x, y);
    this.background = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, width, color);   
    this.add(this.background)
    this._piece = piece;
    this.width = width;
    this.height = width;
  }

  public set piece(piece: Piece) {
    this._piece = piece;
    this._piece.setDisplaySize(this.width, this.height)
    this.add(this._piece)
  }
} 