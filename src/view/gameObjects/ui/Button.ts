import { buttonDefaultText } from "../../style/textStyle";
import ThemeManager from "../../style/ThemeManager";

export interface ButtonProperties {
    text?: string
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
    background?: Phaser.GameObjects.Graphics
    hitArea?: Phaser.Geom.Rectangle | Phaser.Geom.Circle | Phaser.Geom.Polygon 
    callback?: () => void
}


export default class Button extends Phaser.GameObjects.Container {
    background: Phaser.GameObjects.Graphics;
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
        this.background = properties.background ?? this.createBackground()
        this.hitArea = properties.hitArea ?? this.createHitArea();
        this.add([this.background, this.text])
        this.callback = properties.callback ?? (() => {})
        this.createEvents();
    }

    createBackground(): Phaser.GameObjects.Graphics {
        const width = 80
        const height = 30
        const radius = 10
        const background = this.scene.add.graphics();
        background.lineStyle(4, ThemeManager.getTheme().ui.button.default.stroke)
        background.strokeRoundedRect(-width/2, -height/2, width, height, radius)
        background.fillStyle(ThemeManager.getTheme().ui.button.default.fill) 
        background.fillRoundedRect(-width/2, -height/2, width, height, radius)
        return background
    }

    createHitArea(): Phaser.Geom.Rectangle {
        const width = 80
        const height = 30
        return new Phaser.Geom.Rectangle(-width/2, -height/2, width, height)
    }
    
    createEvents() {
        this.setInteractive({
            hitArea: this.hitArea,
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            useHandCursor: true
        })
        this.on(Phaser.Input.Events.POINTER_DOWN, this.callback)
    }
}