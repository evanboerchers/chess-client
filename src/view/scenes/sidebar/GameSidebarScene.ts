import SidebarScene from "./SidebarScene";

export default class GameSidebarScene extends SidebarScene {
    constructor() {
        super("GameSidebar");
    }

    create(): void {
        super.create();
        const sidebarX = this.scale.width * 0.75 + 10;

        this.createPlayerPanel(sidebarX, 20, "Black");
        this.createPlayerPanel(sidebarX, this.scale.height - 100, "White");
    }

    private createPlayerPanel(x: number, y: number, player: string): void {
        this.add.rectangle(x + 90, y + 25, 180, 50, 0x555555);
        this.add.circle(x + 20, y + 25, 20, 0xffffff);
        this.add.text(x + 50, y + 15, `${player} Player`, { fontSize: "16px", color: "#fff" });

        if (Math.random() > 0.5) {
            this.add.text(x + 150, y + 15, "Resign", { fontSize: "14px", color: "#f00" }).setInteractive();
            this.add.text(x + 150, y + 35, "Draw", { fontSize: "14px", color: "#ff0" }).setInteractive();
        }
    }
}