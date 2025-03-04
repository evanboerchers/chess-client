import ThemeManager from "../../style/ThemeManager";

interface PlayerCustomModalProperties {
    backgroundColour?: number;
    backgroundAlpha?: number;
    borderColor?: number;
    borderThickness?: number;
    cornerRadius?: number;
    textInputHeight?: number;
    textInputPadding?: number;
    profileIconSize?: number;
    profileIconPadding?: number;
    iconsPerRow?: number;
    selectedOutlineColor?: number;
    selectedOutlineThickness?: number;
    fontFamily?: string;
    fontSize?: string;
    fontColor?: string;
    placeholderText?: string;
    maxNameLength?: number;
    minNameLength?: number;
}

interface PlayerData {
    name: string;
    iconTextureKey: string;
    iconIndex: number;
}

export default class PlayerCustomModal extends Phaser.GameObjects.Container {
    private gbWidth: number;
    private bgHeight: number;
    private properties: Required<PlayerCustomModalProperties>;
    private contentContainer: Phaser.GameObjects.Container;
    private background: Phaser.GameObjects.Graphics;
    private textInputBackground: Phaser.GameObjects.Graphics;
    private nameText: Phaser.GameObjects.Text;
    private selectedIconIndex: number;
    private playerName: string;
    private profileIcons: Array<Phaser.GameObjects.Sprite & { outlineGraphic?: Phaser.GameObjects.Graphics }>;
    private isInputActive: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, properties: PlayerCustomModalProperties = {}) {
        super(scene, x, y);
        this.scene = scene;
        this.gbWidth = width;
        this.bgHeight = height;
        
        // Default options with TypeScript type safety
        this.properties = {
            backgroundColour: ThemeManager.getTheme().ui.sidebarColour,
            backgroundAlpha: 1,
            borderColor: 0xffffff,
            borderThickness: 2,
            cornerRadius: 16,
            textInputHeight: 50,
            textInputPadding: 10,
            profileIconSize: 64,
            profileIconPadding: 10,
            iconsPerRow: 4,
            selectedOutlineColor: 0xffff00,
            selectedOutlineThickness: 4,
            fontFamily: 'Arial',
            fontSize: '18px',
            fontColor: '#ffffff',
            placeholderText: 'Enter name (5-15 chars)',
            maxNameLength: 15,
            minNameLength: 5,
            ...properties
        };
        
        this.selectedIconIndex = 0;
        this.playerName = '';
        this.profileIcons = [];
        this.isInputActive = false;
        this.contentContainer = this.scene.add.container(-this.gbWidth/2, -this.bgHeight/2)
        this.contentContainer.name = 'contentContainer'
        this.add(this.contentContainer);
        this.createBackground();
        this.createTextInput();
        this._createProfileIconsGrid();
        scene.add.existing(this);
    }
    
    private createBackground(): void {
        this.background = this.scene.add.graphics();
        this.background.name = 'backgroundGraphic'
        this.background.fillStyle(this.properties.backgroundColour, this.properties.backgroundAlpha);
        this.background.lineStyle(this.properties.borderThickness, this.properties.borderColor);
        this.background.fillRoundedRect(-this.gbWidth/2, -this.bgHeight/2, this.gbWidth, this.bgHeight, this.properties.cornerRadius);
        this.background.strokeRoundedRect(-this.gbWidth/2, -this.bgHeight/2, this.gbWidth, this.bgHeight, this.properties.cornerRadius);
        this.add(this.background);
    }
    
    private createTextInput(): void {
        const inputWidth = this.gbWidth - (this.properties.textInputPadding * 2);
        const inputY = this.properties.textInputPadding;
        const inputX = this.properties.textInputPadding;
        
        this.textInputBackground = this.scene.add.graphics();
        this.textInputBackground.fillStyle(0x000000, 0.5);
        this.textInputBackground.lineStyle(1, 0xffffff);
        this.textInputBackground.fillRoundedRect(inputX, inputY, inputWidth, this.properties.textInputHeight, 8);
        this.textInputBackground.strokeRoundedRect(inputX, inputY, inputWidth, this.properties.textInputHeight, 8);
        this.contentContainer.add(this.textInputBackground);
        
        // Create text display
        this.nameText = this.scene.add.text(
            inputX + 10, 
            inputY + (this.properties.textInputHeight / 2), 
            this.properties.placeholderText, 
            {
                fontFamily: this.properties.fontFamily,
                fontSize: this.properties.fontSize,
                color: this.properties.fontColor,
                align: 'left'
            }
        );
        this.nameText.setOrigin(0, 0.5);
        this.add(this.nameText);
        
        // Make text input interactive
        this.textInputBackground.setInteractive(
            new Phaser.Geom.Rectangle(
                inputX, 
                inputY, 
                inputWidth, 
                this.properties.textInputHeight
            ), 
            Phaser.Geom.Rectangle.Contains
        );
        
        this.textInputBackground.on('pointerdown', () => {
            this.activateTextInput();
        });
    }
    
    public activateTextInput(): void {
        this.isInputActive = true;
        this.textInputBackground.clear();
        this.textInputBackground.fillStyle(0x222222, 0.7);
        this.textInputBackground.lineStyle(2, 0x00ff00);
        this.textInputBackground.fillRoundedRect(
            this.properties.textInputPadding, 
            this.properties.textInputPadding, 
            this.gbWidth - (this.properties.textInputPadding * 2), 
            this.properties.textInputHeight, 
            8
        );
        this.textInputBackground.strokeRoundedRect(
            this.properties.textInputPadding, 
            this.properties.textInputPadding, 
            this.gbWidth - (this.properties.textInputPadding * 2), 
            this.properties.textInputHeight, 
            8
        );
        
        // Show the current name or placeholder
        if (this.playerName === '') {
            this.nameText.setText('|');
        } else {
            this.nameText.setText(this.playerName + '|');
        }
        
        // Setup keyboard capture if it's not already set up
        this.scene.input.keyboard?.on('keydown', this.handleKeyPress, this);
    }
    
    public deactivateTextInput(): void {
        this.isInputActive = false;
        this.textInputBackground.clear();
        this.textInputBackground.fillStyle(0x000000, 0.5);
        this.textInputBackground.lineStyle(1, 0xffffff);
        this.textInputBackground.fillRoundedRect(
            this.properties.textInputPadding, 
            this.properties.textInputPadding, 
            this.gbWidth - (this.properties.textInputPadding * 2), 
            this.properties.textInputHeight, 
            8
        );
        this.textInputBackground.strokeRoundedRect(
            this.properties.textInputPadding, 
            this.properties.textInputPadding, 
            this.gbWidth - (this.properties.textInputPadding * 2), 
            this.properties.textInputHeight, 
            8
        );
        
        // Update displayed text
        if (this.playerName === '') {
            this.nameText.setText(this.properties.placeholderText);
        } else {
            this.nameText.setText(this.playerName);
        }
        
        // Remove keyboard listener
        this.scene.input.keyboard?.off('keydown', this.handleKeyPress, this);
    }
    
    private handleKeyPress(event: KeyboardEvent): void {
        if (!this.isInputActive) return;
        
        // Handle backspace
        if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
            this.playerName = this.playerName.slice(0, -1);
        }
        // Handle Enter key to deactivate input
        else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
            if (this.playerName.length >= this.properties.minNameLength) {
                this.deactivateTextInput();
            }
        }
        // Handle regular text input
        else if ((event.keyCode >= Phaser.Input.Keyboard.KeyCodes.A && 
                  event.keyCode <= Phaser.Input.Keyboard.KeyCodes.Z) || 
                 (event.keyCode >= Phaser.Input.Keyboard.KeyCodes.ZERO && 
                  event.keyCode <= Phaser.Input.Keyboard.KeyCodes.NINE) ||
                 event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
            
            // Only add character if we're under max length
            if (this.playerName.length < this.properties.maxNameLength) {
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
                this.playerName += char;
            }
        }
        
        // Update the text display
        this.nameText.setText(this.playerName + '|');
    }
    
    private _createProfileIconsGrid(): void {
        // Calculate grid layout
        const gridStartY = this.properties.textInputPadding * 2 + this.properties.textInputHeight;
        const iconSize = this.properties.profileIconSize;
        const padding = this.properties.profileIconPadding;
        const iconsPerRow = this.properties.iconsPerRow;
        
        // Find all available profile icons (search for all loaded images with 'profile' prefix)
        const profileTextureKeys = this._getProfileTextureKeys();
        
        // Create grid of icons
        let row = 0;
        let col = 0;
        
        profileTextureKeys.forEach((key, index) => {
            // Calculate position
            const x = padding + (col * (iconSize + padding)) + iconSize/2;
            const y = gridStartY + padding + (row * (iconSize + padding)) + iconSize/2;
            
            // Create sprite
            const icon = this.scene.add.sprite(x, y, key);
            icon.setDisplaySize(iconSize, iconSize);
            icon.setInteractive();
            icon.on('pointerdown', () => {
                this.selectIcon(index);
            });
            
            // Add to container
            this.add(icon);
            this.profileIcons.push(icon);
            
            // Create selection outline (invisible by default)
            const outline = this.scene.add.graphics();
            outline.lineStyle(this.properties.selectedOutlineThickness, this.properties.selectedOutlineColor);
            outline.strokeRect(
                x - iconSize/2 - this.properties.selectedOutlineThickness/2,
                y - iconSize/2 - this.properties.selectedOutlineThickness/2,
                iconSize + this.properties.selectedOutlineThickness,
                iconSize + this.properties.selectedOutlineThickness
            );
            outline.visible = (index === this.selectedIconIndex);
            this.add(outline);
            // icon.outlineGraphic = outline;
            
            // Update row/col
            col++;
            if (col >= iconsPerRow) {
                col = 0;
                row++;
            }
        });
    }
    
    private _getProfileTextureKeys(): string[] {
        // Get all texture keys from the scene's texture manager
        const textureKeys = this.scene.textures.getTextureKeys();
        
        // Filter keys that match profile image pattern
        return textureKeys.filter(key => key.startsWith('profile'));
    }
    
    public selectIcon(index: number): void {
        // Deselect previous icon
        if (this.profileIcons[this.selectedIconIndex]) {
            // this.profileIcons[this.selectedIconIndex].outlineGraphic.visible = false;
        }
        
        // Select new icon
        this.selectedIconIndex = index;
        // this.profileIcons[this.selectedIconIndex].outlineGraphic.visible = true;
        
        // If text input is active, deactivate it
        if (this.isInputActive) {
            this.deactivateTextInput();
        }
    }
    
    // Get the player customization data
    public getPlayerData(): PlayerData {
        return {
            name: this.playerName,
            iconTextureKey: this._getProfileTextureKeys()[this.selectedIconIndex],
            iconIndex: this.selectedIconIndex
        };
    }
    
    // Check if player has completed required customization
    public isCustomizationComplete(): boolean {
        return this.playerName.length >= this.properties.minNameLength;
    }
    
    // Public method to reset
    public reset(): void {
        this.playerName = '';
        this.nameText.setText(this.properties.placeholderText);
        this.selectIcon(0);
        this.deactivateTextInput();
    }
}