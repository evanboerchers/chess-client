import { Boot } from './view/scenes/Boot';
import { Game as MainGame } from './view/scenes/Game';
import { GameOver } from './view/scenes/GameOver';
import { MainMenu } from './view/scenes/MainMenu';
import { Preloader } from './view/scenes/Preloader';

import { Game, Types } from "phaser";

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

declare global {
    interface Window {
        __PHASER_GAME__: Game;
    }
}

const game  = new Game(config);
window.__PHASER_GAME__ = game;
export default game
