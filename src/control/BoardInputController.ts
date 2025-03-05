import { ChessGame, Move, PieceColour } from '@evanboerchers/chess-core';
import { Input } from 'phaser';
import Board from '../view/gameObjects/board/Board';
import BoardSquare from '../view/gameObjects/board/BoardSquare';

export default class BoardInputController {
  board: Board;
  gameModel: ChessGame;

  constructor(board: Board, gameModel: ChessGame) {
    this.board = board;
    this.gameModel = gameModel;
  }

  setupPieceSelection(colour: PieceColour, moveCallback: (move: Move) => void) {
    this.board.squares.flat().forEach((square) => {
      if (square.piece && square.piece.colour === colour) {
        console.log('setting up piece selection: ', square.piece.name);
        square.setInteractive({ useHandCursor: true });
        square.on('pointerdown', () =>
          this.handlePieceSelection(square, colour, moveCallback)
        );
      }
    });
  }

  handlePieceSelection(
    square: BoardSquare,
    colour: PieceColour,
    moveCallback: (move: Move) => void
  ) {
    console.log(
      'piece clicked: ',
      square.piece?.colour,
      square.piece?.pieceType,
      square.boardPosition
    );
    this.clearBoardActions();
    square.highlight();
    const potentialMoves = this.gameModel.potentialMoves(square.boardPosition);
    this.setupPieceSelection(colour, moveCallback);
    this.setupPotentialMoves(potentialMoves, moveCallback);
  }

  setupPotentialMoves(moves: Move[], moveCallback: (move: Move) => void) {
    moves.forEach((move) => {
      const square = this.board.squares[move.to.row][move.to.col];
      if (move.capturedPiece) {
        square.highlightCapture();
      } else if (move.castle) {
        square.highlightMove();
      } else {
        square.highlightMove();
      }
      square.setInteractive({ useHandCursor: true });
      square.on(Input.Events.POINTER_DOWN, () => {
        this.clearBoardActions();
        moveCallback(move);
      });
    });
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
