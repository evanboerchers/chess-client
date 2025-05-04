import {
    ChessGame,
  } from '@evanboerchers/chess-core';
  import BoardInputController from '../BoardInputController';
  import { GameInstance } from './GameInstance.types';
  import GameSideBarInputController from '../GameSideBarInputController';
import gameController from '../GameController';
  
  export default class MenuGameInstance implements GameInstance {
    gameModel: ChessGame;
    boardInputController?: BoardInputController;
    gameSidebarInputController?: GameSideBarInputController
    
    
    constructor(
      gameModel?: ChessGame,
    ) {
      this.gameModel = gameModel ?? new ChessGame();
    }

    reload: () => void;
  }
  