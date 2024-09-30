import { Scene } from 'phaser';
import Piece from './Piece';
import ThemeManager from '../ThemeManager';
import { BoardCoordinate } from '../../model/board/board.types';

export enum SquareColour {
  Light,
  Dark,
}

export default class BoardSquare extends Phaser.GameObjects.Container {
  public background: Phaser.GameObjects.Rectangle;
  public _piece?: Piece;
  public colour: SquareColour;
  public coordinate: BoardCoordinate;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    colour: SquareColour,
    coordinate: BoardCoordinate,
    piece?: Piece
  ) {
    super(scene, x, y);
    this.colour = colour;
    this.background = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      width,
      width,
      this.getBackgroundColour()
    );
    this.add(this.background);
    this._piece = piece;
    this.width = width;
    this.height = width;
    this.coordinate = coordinate;
  }

  private getBackgroundColour(): number {
    const bgColour =
      this.colour === SquareColour.Light
        ? ThemeManager.getTheme().board.lightSquareColour
        : ThemeManager.getTheme().board.darkSquareColour;
    return bgColour;
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

  public highlightCapture() {
    this.background.setFillStyle(ThemeManager.getTheme().board.attackColour);
  }

  public highlightMove() {
    this.background.setFillStyle(ThemeManager.getTheme().board.moveColour);
  }

  public clearHighlight() {
    this.background.setFillStyle(this.getBackgroundColour());
  }
}
