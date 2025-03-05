export interface IconSelectionGridProperties {
    iconsPerRow?: number
    iconPadding?: number
    iconSize?: number
    outlineColour?: number
    outlineThickness?: number
    texturePrefix?: string
}

export const defaultProperties: Required<IconSelectionGridProperties> = {
    iconsPerRow: 5,
    iconPadding: 10,
    iconSize: 75,
    outlineColour: 0xffffff,
    outlineThickness: 4,
    texturePrefix: 'profile'
}

export default class IconSelectionGrid extends Phaser.GameObjects.Container {
    private selectedIconKey: string;
    private icons: Map<string, Phaser.GameObjects.Sprite & { outlineGraphic?: Phaser.GameObjects.Graphics }>;
    private properties: Required<IconSelectionGridProperties>;


    constructor(scene: Phaser.Scene, x: number, y: number, properties: IconSelectionGridProperties) {
        super(scene, x, y);
        this.properties = {
            ...defaultProperties,
            ...properties
        }
        this.icons = new Map();
        this.createProfileIconsGrid();
    }

    private createProfileIconsGrid(): void {
        const iconSize = this.properties.iconSize;
        const padding = this.properties.iconPadding;
        const iconsPerRow = this.properties.iconsPerRow;
        const centerX = ((padding + iconSize) * this.properties.iconsPerRow) / 2
        const profileTextureKeys = this.getProfileTextureKeys();
        
        let row = 0;
        let col = 0;
        
        profileTextureKeys.forEach((key, index) => {
            const x = (padding + (col * (iconSize + padding)) + iconSize/2) - centerX;
            const y = padding + (row * (iconSize + padding)) + iconSize/2;
            
            const icon = this.scene.add.sprite(x, y, key);
            icon.setDisplaySize(iconSize, iconSize);
            icon.setInteractive();
            icon.on('pointerdown', () => {
                this.selectIcon(key);
            });
            
            this.add(icon);
            this.icons.set(key, icon);
            
            const outline = this.scene.add.graphics();
            outline.lineStyle(this.properties.outlineThickness, this.properties.outlineColour);
            outline.strokeRect(
                x - iconSize/2 - this.properties.outlineThickness/2,
                y - iconSize/2 - this.properties.outlineThickness/2,
                iconSize + this.properties.outlineThickness,
                iconSize + this.properties.outlineThickness
            );
            outline.visible = (key === this.selectedIconKey);
            this.add(outline);

            col++;
            if (col >= iconsPerRow) {
                col = 0;
                row++;
            }
        });
    }
    
    private getProfileTextureKeys(): string[] {
        const textureKeys = this.scene.textures.getTextureKeys();
        return textureKeys.filter(key => key.startsWith(this.properties.texturePrefix));
    }
    
    public selectIcon(key: string): void {
        if (this.icons.get(key)) {
            const outline = this.icons.get(this.selectedIconKey)?.outlineGraphic
            if (outline) outline.visible = false;
        }
        this.selectedIconKey = key;
        const outline = this.icons.get(key)?.outlineGraphic;
        if (outline) outline.visible = true;
    }
}