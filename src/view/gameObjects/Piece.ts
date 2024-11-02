import { Scene } from 'phaser';
import { PieceColour, PieceType } from '../../model/board/pieces/pieces.types';

const getPieceTexture = (type: PieceType, colour: PieceColour): string => {
  let colourPrefix;
  let typeName;
  switch (colour) {
    case PieceColour.Black:
      colourPrefix = 'black';
      break;
    default:
      colourPrefix = 'white';
  }

  switch (type) {
    case PieceType.Wizard:
      typeName = 'King';
      break;
    case PieceType.Queen:
      typeName = 'Queen';
      break;
    case PieceType.Knight:
      typeName = 'Knight';
      break;
    case PieceType.Bishop:
      typeName = 'Bishop';
      break;
    case PieceType.Rook:
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
