import { PieceColour } from "@evanboerchers/chess-core";
import ThemeManager from "../../style/ThemeManager";
import { playerrNameText as playerName } from "../../style/textStyle";

export interface BannerProperties {
    playerName: string,
    iconTexture: string,
    colour: PieceColour
}

export default class PlayerBanner extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Graphics;
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
        const x = -width/2; 
        const y = -height/2;
        const radius = 10; 
        const strokeColour = colour === PieceColour.WHITE ? 0xffffff : 0x000000
        this.background = this.scene.add.graphics()
        this.background.lineStyle(4, strokeColour)
        this.background.strokeRoundedRect(x, y, width, height, radius)
        this.background.fillStyle(ThemeManager.getTheme().ui.bannerColour, 0.8)
        this.background.fillRoundedRect(x, y, width, height, radius)
        this.add(this.background)
    }
}
