export default class PlayerPanel extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Rectangle;
    private icon: Phaser.GameObjects.Image;
    private nameText: Phaser.GameObjects.Text;
    private drawButton?: Phaser.GameObjects.Rectangle;
    private resignButton?: Phaser.GameObjects.Rectangle;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        playerName: string,
        iconTexture: string,
        showButtons: boolean = true
    ) {
        super(scene, x, y);
        this.scene = scene;

        // Background panel
        this.background = scene.add.rectangle(0, 0, 200, 100, 0x222222, 0.8);
        this.background.setOrigin(0, 0);

        // Player Icon
        this.icon = scene.add.image(10, 10, iconTexture).setOrigin(0, 0);
        this.icon.setDisplaySize(40, 40); // Adjust as needed

        // Player Name
        this.nameText = scene.add.text(60, 20, playerName, {
            fontSize: "16px",
            color: "#ffffff",
        });

        this.add([this.background, this.icon, this.nameText]);

        if (showButtons) {
            this.createButtons();
        }
    }

    private createButtons(): void {
        // Draw Button
        this.drawButton = this.createButton(10, 60, "Draw", () => {
            this.emit("drawClicked");
        });

        // Resign Button
        this.resignButton = this.createButton(110, 60, "Resign", () => {
            this.emit("resignClicked");
        });

        this.add([this.drawButton, this.resignButton]);
    }

    private createButton(
        x: number,
        y: number,
        text: string,
        callback: () => void
    ): Phaser.GameObjects.Rectangle {
        let button = this.scene.add.rectangle(x, y, 80, 30, 0x4444ff, 1).setOrigin(0, 0);
        let buttonText = this.scene.add.text(x + 10, y + 5, text, {
            fontSize: "14px",
            color: "#ffffff",
        });

        button.setInteractive();
        button.on("pointerdown", callback);

        this.add([button, buttonText]);
        return button;
    }
}
