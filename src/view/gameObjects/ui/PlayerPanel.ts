import { panelButtonText } from "../../style/textStyle";
import ThemeManager from "../../style/ThemeManager";
import PlayerBanner, { BannerProperties } from "./PlayerBanner";

export interface PanelProperties {
    bannerProps: BannerProperties
    showButtons: boolean
}

export default class PlayerPanel extends Phaser.GameObjects.Container {
    private banner: PlayerBanner
    private drawButton?: Phaser.GameObjects.Container;
    private resignButton?: Phaser.GameObjects.Container;

    constructor(
        scene: Phaser.Scene,
        x: number, 
        y: number,
        properties: PanelProperties
    ) {
        super(scene, x, y);
        this.scene = scene;
        this.banner = new PlayerBanner(this.scene, 0, 0, properties.bannerProps)
        this.add(this.banner)
        if (properties.showButtons) {
            this.createButtons();
        }
    }

    private createButtons(): void {
        this.drawButton = this.createButton(50, 60, "Draw", () => {
            this.emit("drawClicked");
        });
        this.resignButton = this.createButton(-50, 60, "Resign", () => {
            console.log("resign clicked")
            this.emit("resignClicked");
        });
        this.add([this.drawButton, this.resignButton]);
    }

    private createButton(
        x: number,
        y: number,
        text: string,
        callback: () => void
    ): Phaser.GameObjects.Container {
        const width = 80
        const height = 30
        const radius = 10
        const button = this.scene.add.container();
        const background = this.scene.add.graphics();
        background.lineStyle(4, ThemeManager.getTheme().ui.button.default.stroke)
        background.strokeRoundedRect(x - width/2, y - height/2, width, height, radius)
        background.fillStyle(ThemeManager.getTheme().ui.button.default.fill) 
        background.fillRoundedRect(x - width/2, y - height/2, width, height, radius)
        const buttonText = this.scene.add.text(x, y, text, panelButtonText).setOrigin(0.5);
        button.add([background, buttonText]);
        button.setSize(width, height);
        button.setInteractive({ useHandCursor: true });
        button.on("pointerdown", callback);
        return button;
    }
}
