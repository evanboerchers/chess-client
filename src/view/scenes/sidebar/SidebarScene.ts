import { Scene } from "phaser";

export default class SidebarScene extends Scene {
    constructor(key) {
        super({ key });
    }

    create() {
        this.createBacking();
    }
    
    createBacking() {
        const sidebarX = this.scale.width * 0.75;
        const sidebarWidth = this.scale.width * 0.25;
        const sidebarHeight = this.scale.height;
        this.add.rectangle(sidebarX + sidebarWidth / 2, sidebarHeight / 2, sidebarWidth, sidebarHeight, 0x333333);
    }
}