import { Scene } from 'phaser';
import { SceneNames } from './scenes.enum';
import { GameOutcome } from '@evanboerchers/chess-core';
import { GameOutcomeReason } from './GameOutcomeReason.enum';

export default class PreloaderScene extends Scene {
  constructor() {
    super(SceneNames.PRELOADER);
  }

  init() {
    this.add.image(this.scale.width/2, 275, 'logo').setScale(0.75);

    const barY = 550
    this.add.rectangle(512, barY, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(512 - 230, barY, 4, 28, 0xffffff).setOrigin(0.5);
    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets/board');
    this.load.image('coffeeBean', 'coffee_bean.webp');
    
    this.load.setPath('assets/board/pieces');
    // Black Pieces
    this.load.image('blackPawn', 'b_pawn.webp');
    this.load.image('blackRook', 'b_rook.webp');
    this.load.image('blackKnight', 'b_knight.webp');
    this.load.image('blackBishop', 'b_bishop.webp');
    this.load.image('blackQueen', 'b_queen.webp');
    this.load.image('blackKing', 'b_king.webp');

    // White Pieces
    this.load.image('whitePawn', 'w_pawn.webp');
    this.load.image('whiteRook', 'w_rook.webp');
    this.load.image('whiteKnight', 'w_knight.webp');
    this.load.image('whiteBishop', 'w_bishop.webp');
    this.load.image('whiteQueen', 'w_queen.webp');
    this.load.image('whiteKing', 'w_king.webp');

    this.load.setPath('assets/profile');
    this.load.image('profile1', 'profile_1.webp');
    this.load.image('profile2', 'profile_2.webp');
    this.load.image('profile3', 'profile_3.webp');
    this.load.image('profile4', 'profile_3.webp');
    this.load.image('profile5', 'profile_3.webp');
    this.load.image('profile6', 'profile_3.webp');
    this.load.image('profile7', 'profile_3.webp');
    this.load.image('profile8', 'profile_3.webp');
    this.load.image('profile9', 'profile_3.webp');
    this.load.image('profile10', 'profile_3.webp');
  }

  create() {
    this.scene.start(SceneNames.BOARD);
    this.scene.start(SceneNames.MENU_SIDEBAR);
  }
}
