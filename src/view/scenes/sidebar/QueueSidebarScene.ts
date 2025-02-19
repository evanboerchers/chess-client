import SidebarScene from "./SidebarScene";

export default class QueueSidebarScene extends SidebarScene {
    private queueText!: Phaser.GameObjects.Text;

    constructor() {
        super("QueueSidebar");
    }

    create(): void {
        super.create();
        const sidebarX = this.scale.width * 0.75 + 10;

        this.add.text(sidebarX, 20, "Looking for match...", { fontSize: "18px", color: "#fff" });
        this.queueText = this.add.text(sidebarX, 50, "Number of players in queue: 0", { fontSize: "16px", color: "#fff" });

        this.registry.events.on("updateQueue", (count: number) => {
            this.queueText.setText(`Number of players in queue: ${count}`);
        });
    }
}