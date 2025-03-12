import gameController from '../../../control/GameController';
import { menuText, menuText_Hover } from '../../style/textStyle';
import { SceneNames } from '../scenes.enum';
import { defaultInitData } from './GameSidebarScene';
import SidebarScene from './SidebarScene';

export default class MenuSidebarScene extends SidebarScene {
  menuContainer: Phaser.GameObjects.Container;
  buttons: Phaser.GameObjects.Text[];

  constructor() {
    super(SceneNames.MENU_SIDEBAR);
  }

  create(): void {
    super.create();
    this.buttons = [];
    this.createMenuButtons();
  }

  createMenuButtons() {
    this.menuContainer = this.add.container(0, this.background.y);
    this.contentContainer.add(this.menuContainer);
    this.buttons.unshift(
      this.createButton('Online Play', () => {
        this.scene.start(SceneNames.QUEUE_SIDEBAR);
      })
    );
    this.buttons.unshift(
      this.createButton('Local Play', () => {
        this.scene.start(SceneNames.GAME_SIDEBAR, defaultInitData)
        gameController.setupLocalGame();
      })
    );
    let y = 0;
    for (let i = 0; i < this.buttons.length; i++) {
      this.menuContainer.add(this.buttons[i]);
      this.buttons[i].y = y;
      y -= 50;
    }
    this.menuContainer.y -= this.menuContainer.height / 2;
  }

  createButton(name: string, onClick: () => void): Phaser.GameObjects.Text {
    const button = this.add
      .text(0, 140, name, menuText)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .on(Phaser.Input.Events.POINTER_DOWN, () => onClick())
      .on(Phaser.Input.Events.POINTER_OVER, () =>
        button.setStyle(menuText_Hover)
      )
      .on(Phaser.Input.Events.POINTER_OUT, () => button.setStyle(menuText));
    return button;
  }
}
