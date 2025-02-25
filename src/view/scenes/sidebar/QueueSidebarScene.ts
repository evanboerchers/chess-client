import { PieceColour } from "@evanboerchers/chess-core";
import PlayerBanner from "../../gameObjects/ui/PlayerBanner";
import SidebarScene from "./SidebarScene";

export default class QueueSidebarScene extends SidebarScene {
    private queueContainer: Phaser.GameObjects.Container; 
    private banner: PlayerBanner
    private countText: Phaser.GameObjects.Text;
    private waitText: Phaser.GameObjects.Text;

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
        this.queueContainer.add([this.banner, this.countText, this.waitText])
        this.registry.events.on("updateQueue", (count: number) => {
            this.countText.setText(`Players in Queue: ${count}`);
        });
    }


}