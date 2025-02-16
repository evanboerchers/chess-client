import { ChessGame, Move, PieceColour, Position } from "@evanboerchers/chess-core";
import Board from "../view/gameObjects/Board";
import { AgentCallbacks } from "./Agent";
import BoardSquare from "../view/gameObjects/BoardSquare";
import { Input } from "phaser";

export default class BoardInputController {
    board: Board
    gameModel: ChessGame

    constructor(board: Board, gameModel: ChessGame) {
        this.board = board;
        this.gameModel = gameModel;
    }

    setupPieceSelection(colour: PieceColour, moveCallback: (move: Move) => void) {
        this.board.squares.flat().forEach(square => {
            if (square.piece && square.piece.colour === colour) {
                console.log('setting up piece selection: ', square.piece.name);
                square.setInteractive({ useHandCursor: true });
                square.on('pointerdown', () => this.handlePieceSelection(square, colour, moveCallback));
            }
        })
    }

    handlePieceSelection(square: BoardSquare, colour: PieceColour, moveCallback: (move: Move) => void) {
        console.log('piece clicked: ', square.piece?.colour, square.piece?.pieceType, square.coordinate);
        this.clearBoardActions();
        square.highlight();
        const potentialMoves = this.gameModel.potentialMoves(
            square.coordinate
        );
        this.setupPieceSelection(colour, moveCallback);
        this.setupPotentialMoves(potentialMoves, moveCallback);
    }

    setupPotentialMoves(moves: Move[], moveCallback: (move: Move) => void) {
        moves.forEach(move => {
            const square = this.board.squares[move.to.row][move.to.col]
            if (move.capturedPiece) {
                square.highlightCapture()
            } else if (move.castle) {
                square.highlightMove()
            } else {
                square.highlightMove()
            }
            square.setInteractive({ useHandCursor: true });
            square.on(Input.Events.POINTER_DOWN, () => {
                this.clearBoardActions();
                moveCallback(move)}
            )
        })
    }

    clearBoardActions() {
        console.log('clearing board actions');
        this.board.squares.flat().forEach((square) => {
          square.disableInteractive();
          square.off('pointerdown');
        });
        this.board.clearHighlights();
      }
}