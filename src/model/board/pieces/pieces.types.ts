export enum PieceType {
  Wizard = "wizard",
  Queen = "queen",
  Knight = "knight",
  Bishop = "bishop",
  Rook = "rook",
  Pawn = "pawn",
}

export enum PieceColour {
  White = "white",
  Black = "black",
}

export interface PieceData {
  type: PieceType;
  colour: PieceColour;
}
