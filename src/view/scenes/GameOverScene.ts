import { GameOutcome, PieceColour } from "@evanboerchers/chess-core"
import { SceneNames } from "./scenes.enum"

export enum GameOutcomeReason {
    CHECKMATE = "checkmate",
    RESIGN = "resign",
    TIME = "time",
    DRAW = "draw",
    INSUFFICIENT_MATERIAL = "insufficientMaterial",
    ABANDONED = "abandoned",
  }

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
        if (this.initData.rematchCallback) {
            
        }
    }

    createButton() {

    }
}