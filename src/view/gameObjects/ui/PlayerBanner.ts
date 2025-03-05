import { PieceColour } from "@evanboerchers/chess-core";
import ThemeManager from "../../style/ThemeManager";
import { playerNameText as playerName } from "../../style/textStyle";

export interface BannerProperties {
    playerName: string,
    iconTexture: string,
    colour: PieceColour
}

export default class PlayerBanner extends Phaser.GameObjects.Container {
    public background: Phaser.GameObjects.Sprite;
    private icon: Phaser.GameObjects.Image;
    private nameText: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        properties: BannerProperties
    ) {
        super(scene, x, y);
        this.scene = scene;
        
        this.icon = scene.add.image(-70, 0, properties.iconTexture).setOrigin(0.5);
        this.icon.setDisplaySize(40, 40);
        this.nameText = scene.add.text(-30, 0, properties.playerName, playerName).setOrigin(0, 0.5)
        this.createBackground(properties.colour);
        this.add([this.icon, this.nameText]);
    }
    
    createBackground(colour: PieceColour) {
        const width = 200;
        const height = 60;
        const x = 4
        const y = 4
        const radius = 10; 
        const strokeColour = colour === PieceColour.WHITE ? 0xffffff : 0x000000
        const background = this.scene.add.graphics()
        background.lineStyle(4, strokeColour)
        background.strokeRoundedRect(x, y, width, height, radius)
        background.fillStyle(ThemeManager.getTheme().ui.bannerColour, 0.8)
        background.fillRoundedRect(x, y, width, height, radius)
        const texture= `${this.name}-texture-${Math.random() * 100}`
        background.generateTexture(texture, width+8, height+8)
        background.destroy()
        this.background = this.scene.add.sprite(0,0, texture).setOrigin(0.5).setName(texture)
        this.add(this.background)
    }

    setPlayerName(text: string) {
        this.nameText.text = text
    }

    setPlayerIcon(icon: string) {
        this.icon.setTexture(icon)
    }
}
