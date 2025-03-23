import { Scene } from 'phaser';
import { SceneNames } from '../scenes.enum';
import ThemeManager from '../../style/ThemeManager';

export default class SidebarScene extends Scene {
  contentContainer: Phaser.GameObjects.Container;
  background: Phaser.GameObjects.Rectangle;
  title: Phaser.GameObjects.Sprite;
  widthFactor: number;

  constructor(key: string, widthFactor: number = 0.25) {
    super({ key });
    this.widthFactor = widthFactor;
  }

  create() {
    this.createContainer();
    this.createBacking();
    this.createTitle();
  }

  createContainer() {
    const sidebarX =
      this.scale.width * (1 - this.widthFactor) +
      (this.scale.width * this.widthFactor) / 2;
    this.contentContainer = this.add.container(sidebarX, 0);
  }

  createBacking() {
    const sidebarWidth = this.scale.width * this.widthFactor;
    const sidebarHeight = this.scale.height;
    this.background = this.add.rectangle(
      0,
      sidebarHeight / 2,
      sidebarWidth,
      sidebarHeight,
      ThemeManager.getTheme().ui.sidebarColour
    );
    this.contentContainer.add(this.background);
  }

  createTitle() {
    this.title = this.add
      .sprite(this.background.x, 10, 'logo')
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5, 0)
      .setScale(0.2)
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.scene.start(SceneNames.MENU_SIDEBAR);
      });
    this.contentContainer.add(this.title);
  }
}
