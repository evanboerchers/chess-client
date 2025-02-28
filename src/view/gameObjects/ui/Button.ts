import { buttonDefaultText } from "../../style/textStyle";
import ThemeManager from "../../style/ThemeManager";

export interface ButtonProperties {
    text?: string
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
    background?: Phaser.GameObjects.Graphics
    callback?: () => void
}


export default class Button extends Phaser.GameObjects.Container {
    background: Phaser.GameObjects.Graphics;
    text: Phaser.GameObjects.Text;
    callback: () => void

    constructor(
            scene: Phaser.Scene,
            x: number, 
            y: number,
            properties: ButtonProperties,        
        ) {
        super(scene, x, y);
        this.scene = scene;
        
        this.text = this.scene.add.text(0, 0, properties.text ?? '', properties.textStyle ?? buttonDefaultText)
        this.background = properties.background ?? this.createBackground()
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
        background.strokeRoundedRect(this.x - width/2, this.y - height/2, width, height, radius)
        background.fillStyle(ThemeManager.getTheme().ui.button.default.fill) 
        background.fillRoundedRect(width/2, height/2, width, height, radius)
        return background
    }
    
    createEvents() {
        this.background.on(Phaser.Input.Events.POINTER_DOWN, this.callback)
    }
}