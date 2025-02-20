import { menuText } from "../../style/textStyle";
import { SceneNames } from "../scenes.enum";
import SidebarScene from "./SidebarScene";

export default class MenuSidebarScene extends SidebarScene {
    menuContainer: Phaser.GameObjects.Container;
    buttons: Phaser.GameObjects.Text[];

    constructor() {
        super(SceneNames.MENU_SIDEBAR);
    }
    
    create(): void {
        super.create();
        this.buttons = []
        this.createPlayerBanner();
        this.createMenuButtons();
    }

    createMenuButtons() {
        this.menuContainer = this.add.container(0, this.background.y)
        this.contentContainer.add(this.menuContainer);
        this.buttons.push(this.createButton('Online Play', () => {
            this.scene.start(SceneNames.QUEUE_SIDEBAR)
        }))
        this.buttons.push(this.createButton('Local Play', () => {
            this.scene.start(SceneNames.GAME_SIDEBAR)
        }))
        let y = 0 
        for(let i = 0; i < this.buttons.length; i++) {
            this.menuContainer.add(this.buttons[i]);
            this.buttons[i].y = y
            y -= 50
        }
        this.menuContainer.y -= this.menuContainer.height / 2;
    }
    
    createPlayerBanner(): void {
        
    }

    createButton(name: string, onClick: () => void): Phaser.GameObjects.Text {
        const button = this.add.text(0, 140, name, menuText)
        .setInteractive({ useHandCursor: true }).setOrigin(0.5)
        .on(Phaser.Input.Events.POINTER_DOWN, () => onClick())
        return button
    }
}