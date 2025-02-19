import BoardScene from './view/scenes/BoardScene';
import BootScene from './view/scenes/BootScene';
import PreloaderScene from './view/scenes/PreloaderScene';

import { Game, Types } from "phaser";
import GameSidebarScene from './view/scenes/sidebar/GameSidebarScene';
import QueueSidebarScene from './view/scenes/sidebar/QueueSidebarScene';
import MenuSidebarScene from './view/scenes/sidebar/MenuSidebarScene';

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
        BootScene,
        PreloaderScene,
        BoardScene,
        MenuSidebarScene,
        QueueSidebarScene,
        GameSidebarScene,
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
