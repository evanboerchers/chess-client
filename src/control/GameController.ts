import game from '../main';
import { BoardCoordinate } from '../model/board/board.types';
import { movementStrategyMap } from '../model/board/pieces/movement/movementStrategies';
import { PieceColour } from '../model/board/pieces/pieces.types';
import { GameModel } from '../model/gameModel';
import Piece from '../view/gameObjects/Piece';
import { Game } from '../view/scenes/Game';

export default class GameController {
  gameScene: Game;
  gameModel: GameModel;
  _currentPlayer: PieceColour;
  _selectedPiece: BoardCoordinate | null = null;

  constructor(gameScene: Game) {
    this.gameScene = gameScene;
    this.gameModel = new GameModel();
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
    this.gameScene.currentPlayer = PieceColour.White;
    this.setupPieceSelection();
  }

  setupBlackTurn() {
    console.log('setting up black turn');
    this.gameScene.currentPlayer = PieceColour.Black;
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
          const potentialMoves = this.gameModel.boardModel.getPotentialMoves(
            square.coordinate
          );
          this.setupPieceSelection();
          this.setupMoves(potentialMoves.moves);
          this.setupCaptureMoves(potentialMoves.captures);
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

  handlePieceClick(piece: Piece, coordinate: BoardCoordinate) {}

  setupMoves(moves: BoardCoordinate[]) {
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

  setupCaptureMoves(moves: BoardCoordinate[]) {
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

  movePiece(to: BoardCoordinate) {
    console.log('moving piece from: ', this._selectedPiece, ' to: ', to);
    if (this._selectedPiece) {
      this.gameScene.board.movePiece(this._selectedPiece, to);
      this.gameModel.boardModel.movePiece(this._selectedPiece, to);
    }
    this.changeTurn();
  }

  capturePiece(to: BoardCoordinate) {
    console.log('capturing piece from: ', this._selectedPiece, ' to: ', to);
    if (this._selectedPiece) {
      this.gameScene.board.capturePiece(this._selectedPiece, to);
      this.gameModel.boardModel.capturePiece(this._selectedPiece, to);
    }
    this.changeTurn();
  }

  redrawBoard() {
    this.gameScene.board.clearBoard();
    this.gameScene.board.drawPieces();
  }

  changeTurn() {
    this.gameScene.flipBoard();
    if (this.gameScene.currentPlayer === PieceColour.White) {
      this.setupBlackTurn();
    } else {
      this.setupWhiteTurn();
    }
  }
}
