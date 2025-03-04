import { playerNameText } from "../../style/textStyle";

interface InputTextFieldProperties {
    backgroundColour?: number
    width?: number,
    height?: number
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
    maxCharLength?: number,
    minCharLength?: number,
    placeholderTextValue?: string;
}

export default class InputTextField extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Graphics;
    private highlight: Phaser.GameObjects.Graphics;
    private properties: Required<InputTextFieldProperties>
    public inputActive: boolean;
    public text: Phaser.GameObjects.Text;
    public textValue: string;
    constructor(scene: Phaser.Scene, x: number, y: number, properties: InputTextFieldProperties = {}) {
        super(scene, x, y);
        this.properties = {
            backgroundColour: 0x00000,
            width: 100,
            height: 20,
            textStyle: playerNameText,
            placeholderTextValue: 'placeholder',
            minCharLength: 5,
            maxCharLength: 20,
            ...properties
        }
        this.textValue = properties.placeholderTextValue || '';
        this.scene.add.existing(this);

        this.background.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, this.properties.width, this.height), 
            Phaser.Geom.Rectangle.Contains
        );
        this.background.on('pointerdown', () => {
            this.activate();
        });
    }

    createBackground(): void {
        this.background = this.scene.add.graphics();
        this.background.fillStyle(0x000000, 0.5);
        this.background.lineStyle(1, 0xffffff);
        this.background.fillRoundedRect(0, 0, this.properties.width, this.height, 8);
        this.background.strokeRoundedRect(0, 0, this.properties.width, this.properties.height, 8);
        this.add(this.background);
    }
    
    createActiveHighlight(): void {
        this.highlight = this.scene.add.graphics();
        this.highlight.lineStyle(1, 0xffffff);
        this.highlight.fillRoundedRect(0, 0, this.properties.width, this.height, 8);
        this.highlight.strokeRoundedRect(0, 0, this.properties.width, this.properties.height, 8);
        this.add(this.highlight);
    }

    createText(): void {
        this.text = this.scene.add.text(
            10, 
            this.properties.height / 2, 
            'placeholder',
            
        );
        this.text.setOrigin(0, 0.5);
        this.add(this.text);
    }

    public activate(): void {
        this.inputActive = true;
        this.highlight.visible = true;
        if (this.textValue === '') {
            this.text.setText('|');
        } else {
            this.text.setText(this.textValue + '|');
        }
        this.scene.input.keyboard?.on('keydown', this.handleKeyPress, this);
    }

    public deactivate(): void {
        this.inputActive = false;
        this.highlight.visible = false;
        // Update displayed text
        if (this.textValue === '') {
            this.text.setText(this.properties.placeholderTextValue);
        } else {
            this.text.setText(this.textValue);
        }
        
        // Remove keyboard listener
        this.scene.input.keyboard?.off('keydown', this.handleKeyPress, this);
    }

    private handleKeyPress(event: KeyboardEvent): void {
        if (!this.inputActive) return;
        
        // Handle backspace
        if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
            this.textValue = this.textValue.slice(0, -1);
        }
        // Handle Enter key to deactivate input
        else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
            if (this.textValue.length >= this.properties.minNameLength) {
                this.deactivate();
            }
        }
        // Handle regular text input
        else if ((event.keyCode >= Phaser.Input.Keyboard.KeyCodes.A && 
                  event.keyCode <= Phaser.Input.Keyboard.KeyCodes.Z) || 
                 (event.keyCode >= Phaser.Input.Keyboard.KeyCodes.ZERO && 
                  event.keyCode <= Phaser.Input.Keyboard.KeyCodes.NINE) ||
                 event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
            
            // Only add character if we're under max length
            if (this.textValue.length < this.properties.maxTextLength) {
                // Get the actual character from keycode
                let char = '';
                if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
                    char = ' ';
                } else if (event.keyCode >= Phaser.Input.Keyboard.KeyCodes.ZERO && 
                           event.keyCode <= Phaser.Input.Keyboard.KeyCodes.NINE) {
                    char = String.fromCharCode(event.keyCode);
                } else {
                    // Handle shift key for uppercase
                    if (event.shiftKey) {
                        char = String.fromCharCode(event.keyCode);
                    } else {
                        char = String.fromCharCode(event.keyCode).toLowerCase();
                    }
                }
                this.textValue += char;
            }
        }
        this.text.setText(this.textValue + '|');
    }
}