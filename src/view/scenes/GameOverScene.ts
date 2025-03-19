import { GameOutcome, PieceColour } from "@evanboerchers/chess-core"
import { SceneNames } from "./scenes.enum"
import GameOverModal from "../gameObjects/ui/GameOverModal"
import { GameOutcomeReason } from "./GameOutcomeReason.enum"

export interface GameOverSceneData {
    result: {
        outcome: GameOutcome,
        reason: GameOutcomeReason
    }
    rematchCallback?: () => void
}

export default class GameOverScene extends Phaser.Scene {
    initData: GameOverSceneData
    background: Phaser.GameObjects.Rectangle
    modal: GameOverModal

    constructor() {
        super(SceneNames.GAME_OVER)
    }

    init(data: GameOverSceneData) {
        this.initData = data
    }
    
    create() {
        this.background = new Phaser.GameObjects.Rectangle(
            this,
            0,
            0,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.5
          ).setOrigin(0, 0);
        this.add.existing(this.background);
        this.background.setInteractive()
        this.createModal();
        if (this.initData.rematchCallback) {
            
        }
    }

    createModal() {
        this.modal = new GameOverModal(this, this.scale.width/2, this.scale.height/2)
        this.add.existing(this.modal)
    }
}