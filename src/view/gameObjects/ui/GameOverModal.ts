import { Input } from 'phaser';
import { customizationLabelText, gameOverReasonText, gameOverTitleText, playerNameText } from '../../style/textStyle';
import ThemeManager from '../../style/ThemeManager';
import InputTextField, {
  defaultProperties as inputTextFieldDefaultProperties,
  InputTextFieldProperties,
} from './InputTextField';
import IconSelectionGrid, {
  defaultProperties as iconSelectionGridDefaultProperties,
  IconSelectionGridProperties,
} from './IconSelectionGrid';
import playerService from '../../../service/PlayerService';
import Button from './Button';
import { GameOutcome } from '@evanboerchers/chess-core';
import { GameOutcomeReason } from '../../scenes/GameOverScene';

export interface GameOverModalProperties {
  width?: number;
  height?: number;
  backgroundColour?: number;
  backgroundAlpha?: number;
  borderColor?: number;
  borderThickness?: number;
  cornerRadius?: number;
  outcome?: GameOutcome,
  titleTextStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  reasonTextStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  reason?: GameOutcomeReason,
  resignationHandler?: () => any
}

export const defaultProperties: Required<GameOverModalProperties> = {
  width: 500,
  height: 500,
  backgroundColour: ThemeManager.getTheme().ui.sidebarColour,
  backgroundAlpha: 1,
  borderColor: 0xffffff,
  borderThickness: 2,
  cornerRadius: 16,
  titleTextStyle: gameOverTitleText,
  outcome: GameOutcome.DRAW,
  reasonTextStyle: gameOverReasonText,
  reason: GameOutcomeReason.DRAW,
  resignationHandler: () => {}
};

export default class GameOverModal extends Phaser.GameObjects.Container {
  private properties: Required<GameOverModalProperties>;
  private contentContainer: Phaser.GameObjects.Container;
  public background: Phaser.GameObjects.Graphics;
  public menuButton: Button
  public rematchButton: Button

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    properties: GameOverModalProperties = {}
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.properties = {
      ...defaultProperties,
      ...properties,
    };
    this.contentContainer = this.scene.add.container(
      0,
      -this.properties.height / 2
    );
    this.contentContainer.name = 'contentContainer';
    this.createBackground();
    this.add(this.contentContainer);
    scene.add.existing(this);
    this.blockClickThrough();
  }

  private createText(): void {
    let title: string;
    switch (this.properties.outcome) {
      case GameOutcome.DRAW:
        title = 'Draw'
      case GameOutcome.WHITE:
        title = 'White Wins'
      case GameOutcome.BLACK:
        title = 'Black Wins'
    }
    this.scene.add.text(0,0,title,this.properties.titleTextStyle)
    
    let reason: string;
    switch (this.properties.reason) {
      case GameOutcomeReason.ABANDONED:
        reason = 'By Abandonment'
      case GameOutcomeReason.CHECKMATE:
        reason = 'By Checkmate'
      case GameOutcomeReason.DRAW:
        reason = 'By Agreement'
      case GameOutcomeReason.RESIGN:
        reason = 'By Resignation'
      case GameOutcomeReason.INSUFFICIENT_MATERIAL:
        reason = 'By Insufficient Material'
      case GameOutcomeReason.TIME:
        reason = 'By Time' 
    }
    this.scene.add.text(0,0,reason,this.properties.reasonTextStyle)
  }

  private createBackground(): void {
    this.background = this.scene.add.graphics();
    this.background.name = 'backgroundGraphic';
    this.background.fillStyle(
      this.properties.backgroundColour,
      this.properties.backgroundAlpha
    );
    this.background.lineStyle(
      this.properties.borderThickness,
      this.properties.borderColor
    );
    this.background.fillRoundedRect(
      -this.properties.width / 2,
      -this.properties.height / 2,
      this.properties.width,
      this.properties.height,
      this.properties.cornerRadius
    );
    this.background.strokeRoundedRect(
      -this.properties.width / 2,
      -this.properties.height / 2,
      this.properties.width,
      this.properties.height,
      this.properties.cornerRadius
    );
    this.add(this.background);
  }

  private blockClickThrough() {
    this.background.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(
        -this.properties.width / 2,
        -this.properties.height / 2,
        this.properties.width,
        this.properties.height
      ),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });
    this.background.on(
      Phaser.Input.Events.POINTER_DOWN,
      (pointer: Phaser.Input.Pointer) => {
        pointer.event.stopPropagation();
      }
    );
  }
}
