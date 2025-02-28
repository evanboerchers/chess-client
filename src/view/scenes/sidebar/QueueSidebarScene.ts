import { PieceColour } from "@evanboerchers/chess-core";
import PlayerBanner from "../../gameObjects/ui/PlayerBanner";
import SidebarScene from "./SidebarScene";
import ThemeManager from "../../style/ThemeManager";
import Button from "../../gameObjects/ui/Button";

interface Button {
    container: Phaser.GameObjects.Container, 
    text: Phaser.GameObjects.Text, 
    background: Phaser.GameObjects.Graphics
}

export default class QueueSidebarScene extends SidebarScene {
    private queueContainer: Phaser.GameObjects.Container; 
    private banner: PlayerBanner
    private countText: Phaser.GameObjects.Text;
    private waitText: Phaser.GameObjects.Text;
    private button: Phaser.GameObjects.Container;
    private buttonText: Phaser.GameObjects.Text;
    queued: boolean;

    constructor() {
        super("QueueSidebar");
    }

    create(): void {
        super.create();
        this.queueContainer = this.add.container(0, this.scale.height/2);
        this.contentContainer.add(this.queueContainer);
        this.banner = new PlayerBanner(this, 0, -100, {
            playerName: "profile1",
            iconTexture: "profile1",
            colour: PieceColour.WHITE
        })
        this.waitText = this.add.text(0, -20, "Searching...", { fontSize: "18px", color: "#fff" }).setOrigin(0.5);
        this.countText = this.add.text(0, 20, "Players in Queue: 0", { fontSize: "16px", color: "#fff" }).setOrigin(0.5);
        const buttonProps = {
            text:"Queue", 
            callback: () => {
            this.handleQueueClick()
        }}
        this.button = new Button(this, 0, 0, buttonProps)
        this.queueContainer.add([this.banner, this.countText, this.waitText, this.button])
        this.registry.events.on("updateQueue", (count: number) => {
            this.countText.setText(`Players in Queue: ${count}`);
        });
    }

    handleQueueClick() {
        if (this.queued) {

        } else {

        }
    }
}