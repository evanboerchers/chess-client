export enum PieceType {
  Wizard,
  Queen,
  Knight,
  Bishop,
  Rook,
  Pawn,
}

export enum PieceColour {
  White,
  Black,
}

export interface PieceData {
  type: PieceType;
  colour: PieceColour;
}
