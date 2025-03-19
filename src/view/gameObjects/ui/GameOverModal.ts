import { Input } from 'phaser';
import { customizationLabelText, gameOverReasonText, gameOverTitleText, playerNameText } from '../../style/textStyle';
import { GameOutcome } from '@evanboerchers/chess-core';
import ThemeManager from '../../style/ThemeManager';
import Button, { ButtonProperties } from './Button';
import { GameOutcomeReason } from '../../scenes/GameOutcomeReason.enum';
import { SceneNames } from '../../scenes/scenes.enum';
import gameController from '../../../control/GameController';

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
  menuHandler?: null | (() => any) 
  rematchHandler?: null | (() => any) 
}

export const defaultProperties: Required<GameOverModalProperties> = {
  width: 200,
  height: 200,
  backgroundColour: ThemeManager.getTheme().ui.sidebarColour,
  backgroundAlpha: 1,
  borderColor: 0xffffff,
  borderThickness: 2,
  cornerRadius: 16,
  titleTextStyle: gameOverTitleText,
  outcome: GameOutcome.DRAW,
  reasonTextStyle: gameOverReasonText,
  reason: GameOutcomeReason.DRAW,
  menuHandler: null,
  rematchHandler: null,
};

export default class GameOverModal extends Phaser.GameObjects.Container {
  private properties: Required<GameOverModalProperties>;
  private contentContainer: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Graphics;
  public menuButton: Button
  public rematchButton: Button
  private titleText: Phaser.GameObjects.Text 
  private reasonText: Phaser.GameObjects.Text 

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
    this.createText();
    this.createButtons();
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
    this.titleText = this.scene.add.text(0,20,title,this.properties.titleTextStyle).setOrigin(0.5)

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
      default:
        reason = 'By Resignation'
    }
    this.reasonText = this.scene.add.text(0,50,reason,this.properties.reasonTextStyle).setOrigin(0.5)
    this.contentContainer.add([this.titleText, this.reasonText])
  }

  private createButtons(): void {
    const hasRematch = !!this.properties.rematchHandler
    const menuButtonProps: ButtonProperties = {
      text: 'Menu',
      callback: this.properties.menuHandler ?? this.handleMenuClick
    }  
    const menuX = hasRematch ? 100 : 0
    const y = 200
    this.menuButton = new Button(this.scene, menuX, y, menuButtonProps)
    this.contentContainer.add(this.menuButton)
    if (hasRematch) {
      const rematchButtonProps: ButtonProperties = {
        text: 'Menu',
        callback: this.properties.rematchHandler ?? (() => {})
      }  
      this.rematchButton = new Button(this.scene, -menuX, y, rematchButtonProps)
      this.contentContainer.add(this.rematchButton)
    }
  }

  handleMenuClick() {
    this.scene.scene.start(SceneNames.MENU_SIDEBAR)
    this.scene.scene.start(SceneNames.BOARD)
  }
}
