import { BoardModel } from './board/boardModel';
import { PlayerModel } from './playerModel';

export class GameModel {
  public boardModel: BoardModel;
  public player1: PlayerModel;
  public player2: PlayerModel;

  constructor() {
    this.boardModel = new BoardModel();
    this.player1 = new PlayerModel('Player 1', 100, [
      'card1',
      'card2',
      'card3',
    ]);
    this.player2 = new PlayerModel('Player 2', 100, [
      'card1',
      'card2',
      'card3',
    ]);
  }
}
