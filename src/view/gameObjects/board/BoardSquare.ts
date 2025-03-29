import { Scene, Tweens } from 'phaser';
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
  public selectedHighlightSquare: Phaser.GameObjects.Rectangle
  public captureHighlightSquare: Phaser.GameObjects.Rectangle
  public previousMoveHighlightSquare: Phaser.GameObjects.Rectangle
  public moveHighlightSprite: Phaser.GameObjects.Sprite
  public moveHighlightTween: Tweens.Tween
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
    this.width = width;
    this.height = width;
    this.colour = colour;
    this.createBackground();
    this.createMoveHighlightSquares();
    this.createMoveHighlightSprite()
    this.clearHighlights()
    this._piece = piece;
    this.boardPosition = coordinate;
  }

  private createBackground() {
    this.background = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      this.width,
      this.width,
      this.getBackgroundColour()
    );
    this.add(this.background)
  }

  private createMoveHighlightSprite() {
    this.moveHighlightSprite = this.scene.add.sprite(0, 0, 'coffeeBean')
    this.moveHighlightSprite.setOrigin(0.5, 0.5)
    this.moveHighlightSprite.setAlpha(0.9)
    this.moveHighlightSprite.setScale(0.25)
    this.moveHighlightSprite.visible = false
    this.moveHighlightTween = this.scene.tweens.add({
      targets: this.moveHighlightSprite,
      yoyo: true,
      repeat: -1,
      scale: { from: 0.25, to: 0.2 },
      ease: 'Sine.easeInOut',
      duration: 650
    })
    this.add(this.moveHighlightSprite)
  }
  
  private createMoveHighlightSquares() {
    this.selectedHighlightSquare = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      this.width,
      this.width,
      ThemeManager.getTheme().board.highlightColour
    ).setAlpha(0.8)
    this.add(this.selectedHighlightSquare)
    this.captureHighlightSquare = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      this.width,
      this.width,
      ThemeManager.getTheme().board.attackColour
    ).setAlpha(0.8)
    this.add(this.captureHighlightSquare)
    this.previousMoveHighlightSquare = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      this.width,
      this.width,
      ThemeManager.getTheme().board.previousMoveColour
    ).setAlpha(0.8)
    this.add(this.previousMoveHighlightSquare)
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
    if (this._piece) {
      this.remove(this._piece);
      this._piece = undefined;
    }
  }

  get piece(): Piece | undefined {
    return this._piece;
  }

  public highlightSelected() {
    this.selectedHighlightSquare.visible = true
  }
  
  public highlightCapture() {
    this.captureHighlightSquare.visible = true
  }
  
  public highlightMove() {
    this.moveHighlightTween.restart();
    this.moveHighlightSprite.visible = true
  }
  
  public highlightPreviousMove() {
    this.previousMoveHighlightSquare.visible = true
  }
  
  public clearHighlights() {
    this.moveHighlightSprite.visible = false
    this.selectedHighlightSquare.visible = false
    this.captureHighlightSquare.visible = false
    this.previousMoveHighlightSquare.visible = false
  }
  
  public clearActionHighlights() {
    this.moveHighlightSprite.visible = false
    this.selectedHighlightSquare.visible = false
    this.captureHighlightSquare.visible = false
  }

  public clearPreviousMoveHighlight() {
    this.previousMoveHighlightSquare.visible = false
  }
}
