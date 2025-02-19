import SidebarScene from "./SidebarScene";

export default class MenuSidebarScene extends SidebarScene {
    constructor() {
        super("MenuSidebar");
    }

    create(): void {
        super.create();
        const sidebarX = this.scale.width * 0.75 + 10;

        this.add.text(sidebarX, 20, "Player", { fontSize: "18px", color: "#fff" });
        this.add.circle(sidebarX + 50, 50, 20, 0xffffff);
        this.add.text(sidebarX + 70, 40, "Username", { fontSize: "16px", color: "#fff" });

        this.add.text(sidebarX, 100, "Online Play", { fontSize: "18px", color: "#0f0" }).setInteractive();
        this.add.text(sidebarX, 140, "Local Play", { fontSize: "18px", color: "#0f0" }).setInteractive();
    }
}