import {
  ChessGame,
  GameOutcome,
  GameState,
  Move,
  PieceColour,
} from '@evanboerchers/chess-core';
import BoardScene from '../view/scenes/BoardScene';
import { Agent } from './agent/Agent.types';
import GameSidebarScene from '../view/scenes/sidebar/GameSidebarScene';
import { GameInstance } from './instance/GameInstance.types';
import MultiplayerGameInstance from './instance/MultiplayerGameInstance';
import LocalGameInstance from './instance/LocalGameInstance';
import BoardInputController from './BoardInputController';
import GameSideBarInputController from './GameSideBarInputController';
import { GameOutcomeReason, GameOverSceneData } from '../view/scenes/GameOverScene';
import { SceneNames } from '../view/scenes/scenes.enum';

export class GameController {
  boardScene: BoardScene;
  gameSidebarScene: GameSidebarScene;
  gameInstance: GameInstance;
  _currentPlayer: Agent;

  constructor() {
    this.gameInstance = new LocalGameInstance();
  }

  setBoardScene(boardScene: BoardScene) {
    this.boardScene = boardScene;
  }

  setGameSidebarScene(gameSidebarScene: GameSidebarScene) {
    this.gameSidebarScene = gameSidebarScene;
  }

  setupMultiplayerGame(playerColour: PieceColour, gameState: GameState) {
    console.log('setting up multiplayer game');
    const model = new ChessGame(gameState);
    const inputController = new BoardInputController(
      this.boardScene.board,
      model
    );
    this.gameInstance = new MultiplayerGameInstance(
      inputController,
      model,
      playerColour
    );
    if (playerColour === PieceColour.BLACK) this.flipBoard();
  }

  setupLocalGame() {
    console.log('setting up local game');
    const model = new ChessGame();
    const boardInputController = new BoardInputController(
      this.boardScene.board,
      model
    );
    const sidebarInputController = new GameSideBarInputController(
      this.gameSidebarScene
    )
    this.gameInstance = new LocalGameInstance(model, boardInputController, sidebarInputController);
  }

  handleMove(move: Move) {
    this.redrawBoard();
  }

  clearBoardHighlights() {
    this.boardScene.board.clearHighlights();
  }

  redrawBoard() {
    this.boardScene.board.clearBoard();
    this.boardScene.board.drawPieces(this.gameInstance.gameModel.board);
    const previousMove = this.gameInstance.gameModel.moveHistory.slice(-1)[0]
    if (previousMove) {
      this.boardScene.board.highlightPreviousMoveSquare(previousMove.from)
      this.boardScene.board.highlightPreviousMoveSquare(previousMove.to)
    }
  }

  flipBoard() {
    this.boardScene.flipBoard();
    this.gameSidebarScene.flip();
  }

  endGame(outcome: GameOutcome, reason: GameOutcomeReason, rematchCallback: () => void) {
    const data: GameOverSceneData = {
      result: {
        outcome,
        reason
      },
      rematchCallback
    }
    this.boardScene.scene.launch(SceneNames.GAME_OVER, data)
  }
}

const gameController = new GameController();
export default gameController;
