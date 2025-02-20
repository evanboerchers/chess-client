import { Scene } from 'phaser';
import Piece from './Piece';
import ThemeManager from '../../style/ThemeManager';
import { Position } from '@evanboerchers/chess-core';

export enum SquareColour {
  Light,
  Dark,
}

export enum EmitEvents {
  Click = 'BoardSquare:click',
}

export default class BoardSquare extends Phaser.GameObjects.Container {
  public background: Phaser.GameObjects.Rectangle;
  public _piece?: Piece;
  public colour: SquareColour;
  public boardPosition: Position;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    colour: SquareColour,
    coordinate: Position,
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
    this.boardPosition = coordinate;
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

  public removePiece() {
    if(this._piece) {
      this.remove(this._piece)
      this._piece = undefined;
    }
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

  public interactive(on: boolean) {
    if (on) {
      this.registerClick();
      this.setInteractive({ useHandCursor: true });
    } else {
      this.deregisterClick();
      this.setInteractive(false);
    }
  }

  private handleClick() {
    this.emit('click', this);
  }

  private deregisterClick() {
    this.off('pointerdown', this.handleClick, this);
  }

  private registerClick() {
    this.on('pointerdown', this.handleClick, this);
  }
}
