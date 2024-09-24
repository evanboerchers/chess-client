import { Piece, PieceColour, PieceType } from "./entities/pieces";

interface SquardInfo {
    piece: Piece | null;
}

export class BoardModel {
    private _board: SquardInfo[][];

    constructor() {
        this._board = Array.from({ length: 8 }, () => Array(8).fill(null));
        this.init();
    }

    public init() {
        const pieceSetup: PieceType[] = [
            PieceType.Rook, PieceType.Knight, PieceType.Bishop, PieceType.Wizard, 
            PieceType.Queen, PieceType.Bishop, PieceType.Knight, PieceType.Rook
        ];
    
        // Set up Black pieces (top rows)
        for (let col = 0; col < 8; col++) {
            this._board[0][col] = { piece: { type: pieceSetup[col], colour: PieceColour.Black } };
            this._board[1][col] = { piece: { type: PieceType.Pawn, colour: PieceColour.Black } };
        }
    
        // Set up White pieces (bottom rows)
        for (let col = 0; col < 8; col++) {
            this._board[7][col] = { piece: { type: pieceSetup[col], colour: PieceColour.White } };
            this._board[6][col] = { piece: { type: PieceType.Pawn, colour: PieceColour.White } };
        }
    
        // Initialize empty squares for middle of the board
        for (let row = 2; row < 6; row++) {
            for (let col = 0; col < 8; col++) {
                this._board[row][col] = { piece: null };
            }
        }
    }

    public get board(): SquardInfo[][] {
        return this._board;
    }

    public set board(value: SquardInfo[][]) {
        this._board = value;
    }
}