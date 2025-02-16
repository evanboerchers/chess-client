import { PieceColour, PieceType } from '@evanboerchers/chess-core';
import { Scene } from 'phaser';

const getPieceTexture = (type: PieceType, colour: PieceColour): string => {
  let colourPrefix;
  let typeName;
  switch (colour) {
    case PieceColour.BLACK:
      colourPrefix = 'black';
      break;
    default:
      colourPrefix = 'white';
  }

  switch (type) {
    case PieceType.KING:
      typeName = 'King';
      break;
    case PieceType.QUEEN:
      typeName = 'Queen';
      break;
    case PieceType.KNIGHT:
      typeName = 'Knight';
      break;
    case PieceType.BISHOP:
      typeName = 'Bishop';
      break;
    case PieceType.ROOK:
      typeName = 'Rook';
      break;
    default:
      typeName = 'Pawn';
  }

  return colourPrefix + typeName;
};

export default class Piece extends Phaser.GameObjects.Sprite {
  public pieceType: PieceType;
  public colour: PieceColour;
  public id?: string
  constructor(
    scene: Scene,
    x: number,
    y: number,
    type: PieceType,
    colour: PieceColour,
    name?: string
  ) {
    super(scene, x, y, getPieceTexture(type, colour));
    this.pieceType = type;
    this.colour = colour;
    if (name) this.name = name
  }
}
