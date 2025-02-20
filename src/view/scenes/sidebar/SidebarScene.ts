import { Scene } from "phaser";
import { SceneNames } from "../scenes.enum";

export default class SidebarScene extends Scene {
    contentContainer: Phaser.GameObjects.Container;
    background: Phaser.GameObjects.Rectangle;
    title: Phaser.GameObjects.Text;
    widthFactor: number;

    constructor(key: string, widthFactor: number = 0.25) {
        super({ key });
        this.widthFactor = widthFactor
    }

    create() {
        this.createContainer();
        this.createBacking();
        this.createTitle();
    }

    createContainer() {
        const sidebarX = this.scale.width * (1 - this.widthFactor) + (this.scale.width * this.widthFactor) / 2;
        this.contentContainer = this.add.container(sidebarX, 0)
    }
    
    createBacking() {
        const sidebarWidth = this.scale.width * this.widthFactor;
        const sidebarHeight = this.scale.height;
        this.background = this.add.rectangle(0, sidebarHeight/2, sidebarWidth, sidebarHeight, 0x333333);
        this.contentContainer.add(this.background)
    }
    
    createTitle() {
        this.title = this.add.text(this.background.x, 10, 'Coffee Chess')
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start(SceneNames.MENU_SIDEBAR)
        })
        this.contentContainer.add(this.title)
    }
}