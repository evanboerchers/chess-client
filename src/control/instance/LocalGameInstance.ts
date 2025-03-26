import {
  ChessGame,
  GameOutcome,
  GameState,
  Move,
  Piece,
  PieceColour,
} from '@evanboerchers/chess-core';
import multiplayerService from '../../service/MultiplayerService';
import BoardInputController from '../BoardInputController';
import gameController from '../GameController';
import { GameInstance } from './GameInstance.types';
import GameSideBarInputController from '../GameSideBarInputController';
import { GameOutcomeReason } from '../../view/scenes/GameOutcomeReason.enum';

export default class LocalGameInstance implements GameInstance {
  gameModel: ChessGame;
  boardInputController?: BoardInputController;
  gameSidebarInputController?: GameSideBarInputController
  
  
  constructor(
    gameModel?: ChessGame,
    boardInputController?: BoardInputController,
    gameSidebarInputController?: GameSideBarInputController
  ) {
    this.gameModel = gameModel ?? new ChessGame();
    this.boardInputController = boardInputController;
    this.gameSidebarInputController = gameSidebarInputController
    if (gameSidebarInputController) this.setupButtons();
    this.gameReady();
  }

  private setupButtons = () => {
    this.gameSidebarInputController?.setupButtonHandlers(
      PieceColour.WHITE, 
      () => this.handleOfferDraw(PieceColour.WHITE), 
      () => this.handleResign(PieceColour.WHITE)
    )
    this.gameSidebarInputController?.setupButtonHandlers(
      PieceColour.BLACK, 
      () => this.handleOfferDraw(PieceColour.BLACK), 
      () => this.handleResign(PieceColour.BLACK)
    )
  }

  private gameReady = () => {
    this.handleMakeMove();
  }

  private handleMoveMade = (move: Move, gameState: GameState) => {
    console.log('handling move made');
    this.gameModel.makeMove(move);
    gameController.handleMove(move);
  }

  private handleWaiting = () => {
    console.log('handling waiting');
  }

  private handleMakeMove = () => {
    console.log('handling make move');
    this.boardInputController?.setupPieceSelection(
      this.gameModel.currentTurn,
      (move: Move) => {
        this.gameModel.makeMove(move);
        this.handleMakeMove();
        gameController.handleMove(move);
      }
    );
  }

  private handleOfferDraw = (colour: PieceColour) => {
    console.log('handle draw offered')
    const oppColour = colour === PieceColour.WHITE ? PieceColour.BLACK : PieceColour.WHITE
    this.gameSidebarInputController?.showDrawOfferTo(oppColour, () => this.handleAcceptDraw(oppColour))
  }
  
  private handleAcceptDraw = (colour: PieceColour) => {
    console.log('handle draw accepted')
    gameController.endGame(GameOutcome.DRAW, GameOutcomeReason.DRAW, this.handleRematch)
  }
  
  private handleResign = (colour: PieceColour) => {
    console.log('handle resign')
    const result = colour === PieceColour.WHITE ? GameOutcome.BLACK : GameOutcome.WHITE
    gameController.endGame(result, GameOutcomeReason.RESIGN, this.handleRematch)
  }

  private handleRematch = () => {
    console.log('handle rematch')
  } 
}
