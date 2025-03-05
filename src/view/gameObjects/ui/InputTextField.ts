import { playerNameText } from "../../style/textStyle";

export interface InputTextFieldProperties {
    backgroundColour?: number;
    outlineColour?: number;
    width?: number;
    height?: number;
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
    maxCharLength?: number;
    minCharLength?: number;
    placeholderTextValue?: string;
}

export const defaultProperties: Required<InputTextFieldProperties> = {
    backgroundColour: 0x000000,
    outlineColour: 0xffffff,
    width: 250,
    height: 50,
    textStyle: playerNameText,
    placeholderTextValue: 'placeholder',
    minCharLength: 5,
    maxCharLength: 12,
}

export default class InputTextField extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Graphics;
    private highlight: Phaser.GameObjects.Graphics;
    private properties: Required<InputTextFieldProperties>
    public inputActive: boolean;
    public text: Phaser.GameObjects.Text;
    public textValue: string;
    private onChange: (text: string) => void
    constructor(scene: Phaser.Scene, x: number, y: number, properties: InputTextFieldProperties = {}, onChange: (text: string) => void = ()=> {}) {
        super(scene, x, y);
        this.properties = {
            ...defaultProperties,
            ...properties
        }
        this.textValue = properties.placeholderTextValue || '';
        this.onChange = onChange;
        this.createBackground();
        this.createActiveHighlight();
        this.background.setInteractive(
            {
                hitArea: new Phaser.Geom.Rectangle(-this.properties.width/2, -this.properties.height/2, this.properties.width, this.properties.height), 
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true,
            }
        );
        this.background.on(Phaser.Input.Events.POINTER_DOWN, this.handleBackgroundClick, this);
        this.createText();
        this.scene.add.existing(this);
        this.deactivate();
    }

    createBackground(): void {
        this.background = this.scene.add.graphics();
        this.background.fillStyle(0x000000, 1);
        this.background.lineStyle(1, 0xffffff);
        this.background.fillRoundedRect(-this.properties.width/2, -this.properties.height/2, this.properties.width, this.properties.height, 8);
        this.background.strokeRoundedRect(-this.properties.width/2, -this.properties.height/2, this.properties.width, this.properties.height, 8);
        this.add(this.background);
    }
    
    createActiveHighlight(): void {
        this.highlight = this.scene.add.graphics();
        this.highlight.lineStyle(2, 0x00ff00);
        this.highlight.fillRoundedRect(-this.properties.width/2, -this.properties.height/2, this.properties.width, this.properties.height, 8);
        this.highlight.strokeRoundedRect(-this.properties.width/2, -this.properties.height/2, this.properties.width, this.properties.height, 8);
        this.add(this.highlight);
    }

    createText(): void {
        this.text = this.scene.add.text(
            0, 
            0, 
            'placeholder',
            this.properties.textStyle            
        );
        this.text.setOrigin(0.5);
        this.add(this.text);
    }

    private handleBackgroundClick(pointer: Phaser.Input.Pointer): void {
        pointer.event.stopPropagation();
        if (!this.inputActive) {
            this.activate();
        }
    }

    public activate(): void {
        console.log("Text input activated")
        this.inputActive = true;
        this.highlight.visible = true;
        this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handleGlobalClick, this);
        this.setText(this.textValue); 
        this.scene.input.keyboard?.on('keydown', this.handleKeyPress, this);
    }

    private handleGlobalClick = (pointer: Phaser.Input.Pointer) => {
        const localPoint = this.background.getLocalPoint(pointer.x, pointer.y);
        const isInside = Phaser.Geom.Rectangle.Contains(
            new Phaser.Geom.Rectangle(
                -this.properties.width/2, 
                -this.properties.height/2, 
                this.properties.width, 
                this.properties.height
            ), 
            localPoint.x, 
            localPoint.y
        );
        if (!isInside) {
            this.deactivate();
        }
    }
    
    public deactivate(): void {
        console.log("Text input deactivated")
        this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.handleGlobalClick)
        this.inputActive = false;
        this.highlight.visible = false;
        // Update displayed text
        if (this.textValue === '') {
            this.setText(this.properties.placeholderTextValue);
        } else {
            this.setText(this.textValue);
        }
        this.scene.input.keyboard?.off('keydown', this.handleKeyPress, this);
    }

    private handleKeyPress(event: KeyboardEvent): void {
        if (!this.inputActive) return;
        
        if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
                this.textValue = this.textValue.slice(0, -1);
        }
        else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
            if (this.textValue.length >= this.properties.minCharLength) {
                this.deactivate();
            }
        }
        else if ((event.keyCode >= Phaser.Input.Keyboard.KeyCodes.A && 
                  event.keyCode <= Phaser.Input.Keyboard.KeyCodes.Z) || 
                 (event.keyCode >= Phaser.Input.Keyboard.KeyCodes.ZERO && 
                  event.keyCode <= Phaser.Input.Keyboard.KeyCodes.NINE) ||
                 event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
            
            if (this.textValue.length < this.properties.maxCharLength) {
                let char = '';
                if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
                    char = ' ';
                } else if (event.keyCode >= Phaser.Input.Keyboard.KeyCodes.ZERO && 
                           event.keyCode <= Phaser.Input.Keyboard.KeyCodes.NINE) {
                    char = String.fromCharCode(event.keyCode);
                } else {
                    if (event.shiftKey) {
                        char = String.fromCharCode(event.keyCode);
                    } else {
                        char = String.fromCharCode(event.keyCode).toLowerCase();
                    }
                }
                this.textValue += char;
            }
        }
        this.setText(this.textValue);
    }

    setText(text: string) {
        this.text.setText(text)
        this.onChange(text)
    }
}