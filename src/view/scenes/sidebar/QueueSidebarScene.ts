import { PieceColour } from "@evanboerchers/chess-core";
import PlayerBanner from "../../gameObjects/ui/PlayerBanner";
import SidebarScene from "./SidebarScene";
import ThemeManager from "../../style/ThemeManager";
import Button, { ButtonProperties } from "../../gameObjects/ui/Button";

export default class QueueSidebarScene extends SidebarScene {
    private queueContainer: Phaser.GameObjects.Container; 
    private banner: PlayerBanner
    private countText: Phaser.GameObjects.Text;
    private searchText: Phaser.GameObjects.Text;
    private button: Button;
    private dotCount: number;
    queued: boolean;

    constructor() {
        super("QueueSidebar");
    }

    create(): void {
        super.create();
        this.queueContainer = this.add.container(0, this.scale.height/2);
        this.contentContainer.add(this.queueContainer);
        this.createPlayerBanner();
        this.searchText = this.add.text(0, 25, "Searching", { fontSize: "18px", color: "#fff" }).setOrigin(0.5);
        this.countText = this.add.text(0, -4, "Players in Queue: 0", { fontSize: "16px", color: "#fff" }).setOrigin(0.5);
        this.createQueueButton();
        this.setButtonToQueue();
        this.queueContainer.add([this.banner, this.countText, this.searchText, this.button])
        this.registry.events.on("updateQueue", (count: number) => {
            this.countText.setText(`Players in Queue: ${count}`);
        });
        this.animateSearchText();
    }

    createPlayerBanner() {
        this.banner = new PlayerBanner(this, 0, -100, {
            playerName: "profile1",
            iconTexture: "profile1",
            colour: PieceColour.WHITE
        })
        this.add.existing(this.banner)
        this.banner.background.setInteractive({ useHandCursor: true})
        .on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.launch('PlayerCustom');
        })
    }

    createQueueButton() {
        // const width = 100
        // const height = 20
        // const radius = 10
        // const background = this.add.graphics();
        // background.lineStyle(4, ThemeManager.getTheme().ui.button.default.stroke)
        // background.strokeRoundedRect(-width/2, -height/2, width, height, radius)
        // background.fillStyle(ThemeManager.getTheme().ui.button.default.fill) 
        // background.fillRoundedRect(-width/2, -height/2, width, height, radius)
        const buttonProps: ButtonProperties = {
            text:"Queue",
            // background: background,
            // hitArea: new Phaser.Geom.Rectangle(-width/2, -height/2, width, height),
            callback: () => {
            this.handleQueueClick()
        }}
        this.button = new Button(this, 0, -40, buttonProps)
    }

    animateSearchText() {
        this.dotCount = 0;
        this.searchText.text = "Searching";
        this.time.addEvent({
            delay: 500,
            callback: this.updateSearchText,
            callbackScope: this,
            loop: true
        })
    }

    updateSearchText() {
        this.dotCount = this.dotCount >= 3 ? 0 :(this.dotCount + 1);
        const dots = Array(this.dotCount).fill('.').join('')
        this.searchText.setText('Searching' + dots);
    }

    
    setButtonToQueue() {
        this.button.text.text = "Queue"
        this.searchText.visible = false;
    }
    
    setButtonToCancel() {
        this.button.text.text = "Cancel"
        this.searchText.visible = true;
    }


    handleQueueClick() {
        if (this.queued) {
            console.log("queue button clicked")
            this.queued = false;
            this.setButtonToQueue();
        } else {
            console.log("cancel button clicked")
            this.queued = true;
            this.setButtonToCancel();

        }
    }
}