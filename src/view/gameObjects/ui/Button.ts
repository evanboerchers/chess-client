import { buttonDefaultText } from "../../style/textStyle";
import ThemeManager from "../../style/ThemeManager";

export interface ButtonProperties {
    text?: string
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
    background?: Phaser.GameObjects.Sprite
    hitArea?: Phaser.Geom.Rectangle | Phaser.Geom.Circle | Phaser.Geom.Polygon 
    callback?: () => void
}


export default class Button extends Phaser.GameObjects.Container {
    _background: Phaser.GameObjects.Sprite;
    text: Phaser.GameObjects.Text;
    hitArea: Phaser.Geom.Rectangle | Phaser.Geom.Circle | Phaser.Geom.Polygon 
    callback: () => void

    constructor(
            scene: Phaser.Scene,
            x: number, 
            y: number,
            properties: ButtonProperties,        
        ) {
        super(scene, x, y);
        this.scene = scene;
        
        this.text = this.scene.add.text(0, 0, properties.text ?? '', properties.textStyle ?? buttonDefaultText).setOrigin(0.5)
        this._background = properties.background ?? this.generateBackground();
        this.hitArea = properties.hitArea ?? this.createHitArea();
        this.add([this._background, this.text])
        this.callback = properties.callback ?? (() => {})
        this.createEvents();
    }

    generateBackground(): Phaser.GameObjects.Sprite {
        // TODO: Make util for converting graphic to sprite
        const width = 80
        const height = 30
        const radius = 10
        const background = this.scene.add.graphics();
        background.lineStyle(4, ThemeManager.getTheme().ui.button.default.stroke)
        background.strokeRoundedRect(4, 4, width, height, radius)
        background.fillStyle(ThemeManager.getTheme().ui.button.default.fill) 
        background.fillRoundedRect(4, 4, width, height, radius)
        const texture= `${this.name}-texture-${Math.random() * 100}`
        background.generateTexture(texture, width+8, height+8)
        background.destroy()
        return this.scene.add.sprite(0, 0, texture).setOrigin(0.5).setName(texture)
    } 

    createHitArea(): Phaser.Geom.Rectangle {
        const width = 80
        const height = 30
        return new Phaser.Geom.Rectangle(-width/2, -height/2, width, height)
    }
    
    createEvents() {
        this._background.setInteractive({
            useHandCursor: true
        })
        this._background.on(Phaser.Input.Events.POINTER_DOWN, this.callback)
    }
}