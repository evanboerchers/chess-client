import { ChessGame, Move, PieceColour, PieceType, Position } from '@evanboerchers/chess-core';
import Piece from '../view/gameObjects/Piece';
import { Game } from '../view/scenes/Game';

export default class GameController {
  gameScene: Game;
  gameModel: ChessGame;
  _currentPlayer: PieceColour;
  _selectedPiece: Position | null = null;

  constructor(gameScene: Game) {
    this.gameScene = gameScene;
    this.gameModel = new ChessGame();
  }

  startGame() {
    this.setupWhiteTurn();
    // this.clearActionsOnclick();
  }

  clearBoardHighlights() {
    this.gameScene.board.clearHighlights();
  }

  setupWhiteTurn() {
    console.log('setting up white turn');
    this.gameScene.currentPlayer = PieceColour.WHITE;
    this.setupPieceSelection();
  }

  setupBlackTurn() {
    console.log('setting up black turn');
    this.gameScene.currentPlayer = PieceColour.WHITE;
    this.setupPieceSelection();
  }

  clearActionsOnclick() {
    this.gameScene.input.on('pointerdown', () => {
      this.clearBoardActions();
    });
  }

  setupPieceSelection() {
    this.gameScene.board.squares.flat().forEach((square) => {
      if (
        square.piece &&
        square.piece.colour === this.gameScene.currentPlayer
      ) {
        console.log('setting up piece selection: ', square.piece.name);
        square.setInteractive({ useHandCursor: true });
        const onClick = () => {
          console.log('piece clicked: ', square.piece?.colour, square.piece?.pieceType, square.coordinate);
          this.clearBoardActions();
          this._selectedPiece = square.coordinate;
          square.highlight();
          const potentialMoves = this.gameModel.potentialMoves(
            square.coordinate
          );
          this.setupPieceSelection();
          this.setupMoves(potentialMoves.filter(move => move.capturedPiece === null || move.capturedPiece === undefined).map(move => move.to));
          this.setupCaptureMoves(potentialMoves.filter(move => move.capturedPiece !== null || move.capturedPiece !== undefined).map(move => move.to));
        };
        square.on('pointerdown', onClick);
      }
    });
  }

  clearBoardActions() {
    console.log('clearing board actions');
    this.gameScene.board.squares.flat().forEach((square) => {
      square.disableInteractive();
      square.off('pointerdown');
    });
    this.gameScene.board.clearHighlights();
  }

  handlePieceClick(piece: Piece, coordinate: Position) { }

  setupMoves(moves: Position[]) {
    moves.forEach((move) => {
      const square = this.gameScene.board.squares[move.row][move.col];
      square.setInteractive({ useHandCursor: true });
      square.highlightMove();
      const handleClick = () => {
        this.clearBoardActions();
        this.movePiece(move);
      };
      square.on('pointerdown', handleClick);
    });
  }

  setupCaptureMoves(moves: Position[]) {
    moves.forEach((move) => {
      const square = this.gameScene.board.squares[move.row][move.col];
      square.setInteractive({ useHandCursor: true });
      square.highlightCapture();
      const handleClick = () => {
        this.clearBoardActions();
        this.capturePiece(move);
      };
      square.on('pointerdown', handleClick);
    });
  }

  movePiece(to: Position) {
    console.log('moving piece from: ', this._selectedPiece, ' to: ', to);
    if (this._selectedPiece && this.gameModel.getPosition(this._selectedPiece)) {
      const piece = <Piece>this.gameModel.getPosition(this._selectedPiece)
      const move: Move = {
        //@ts-expect-error
        piece,
        from: this._selectedPiece,
        to
      }
      this.gameModel.makeMove(move);
      this.gameScene.board.movePiece(this._selectedPiece, to);
    }
    this.changeTurn();
  }

  capturePiece(to: Position) {
    console.log('capturing piece from: ', this._selectedPiece, ' to: ', to);
    if (this._selectedPiece && this.gameModel.getPosition(this._selectedPiece) && this.gameModel.getPosition(to)) {
      const piece = <Piece>this.gameModel.getPosition(this._selectedPiece)
      const capturedPiece = <Piece>this.gameModel.getPosition(to)
      const move: Move = {
        //@ts-expect-error
        capturedPiece,
        //@ts-expect-error
        piece,
        from: this._selectedPiece,
        to
      }
      this.gameScene.board.capturePiece(this._selectedPiece, to);
      this.gameModel.makeMove(move);
    }
    this.changeTurn();
  }

  redrawBoard() {
    this.gameScene.board.clearBoard();
    this.gameScene.board.drawPieces();
  }

  changeTurn() {
    this.gameScene.board.flip();
    if (this.gameScene.currentPlayer === PieceColour.WHITE) {
      this.setupBlackTurn();
    } else {
      this.setupWhiteTurn();
    }
  }
}
