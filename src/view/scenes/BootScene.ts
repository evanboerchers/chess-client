import { Scene } from 'phaser';
import { SceneNames } from './scenes.enum';

export default class BootScene extends Scene {
  constructor() {
    super(SceneNames.BOOT);
  }

  preload() {
    this.load.setPath('assets');
    this.load.image('logo', 'CoffeeChess_logo.webp');
  }

  create() {
    this.scene.start(SceneNames.PRELOADER);
  }
}
