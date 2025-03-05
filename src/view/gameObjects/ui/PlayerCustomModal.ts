import { Input } from 'phaser';
import { customizationLabelText, playerNameText } from '../../style/textStyle';
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

export interface PlayerCustomModalProperties {
  width?: number;
  height?: number;
  backgroundColour?: number;
  backgroundAlpha?: number;
  borderColor?: number;
  borderThickness?: number;
  cornerRadius?: number;
  playerNameInput?: InputTextFieldProperties;
  iconSelectionGrid?: IconSelectionGridProperties;
  labelTextStyle?: Phaser.Types.GameObjects.Text.TextStyle;
}

export const defaultProperties: Required<PlayerCustomModalProperties> = {
  width: 500,
  height: 500,
  backgroundColour: ThemeManager.getTheme().ui.sidebarColour,
  backgroundAlpha: 1,
  borderColor: 0xffffff,
  borderThickness: 2,
  cornerRadius: 16,
  playerNameInput: inputTextFieldDefaultProperties,
  iconSelectionGrid: iconSelectionGridDefaultProperties,
  labelTextStyle: customizationLabelText,
};

export default class PlayerCustomModal extends Phaser.GameObjects.Container {
  private properties: Required<PlayerCustomModalProperties>;
  private contentContainer: Phaser.GameObjects.Container;
  public background: Phaser.GameObjects.Graphics;
  private playerNameInput: InputTextField;
  private iconSelectionGrid: IconSelectionGrid;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    properties: PlayerCustomModalProperties = {}
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
    this.createTextInput();
    this.createIconSelectionGrid();
    this.add(this.contentContainer);
    scene.add.existing(this);
    this.blockClickThrough();
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

  private createTextInput(): void {
    const label = this.scene.add
      .text(0, 25, 'Player Name', this.properties.labelTextStyle)
      .setOrigin(0.5);
    this.playerNameInput = new InputTextField(
      this.scene,
      0,
      75,
      {
        ...this.properties.playerNameInput,
        placeholderTextValue: playerService.getName(),
      },
      (text: string) => {
        playerService.setName(text);
      }
    );
    this.contentContainer.add([this.playerNameInput, label]);
  }

  private createIconSelectionGrid(): void {
    const label = this.scene.add
      .text(0, 150, 'Player Icon', this.properties.labelTextStyle)
      .setOrigin(0.5);
    this.iconSelectionGrid = new IconSelectionGrid(
      this.scene,
      0,
      170,
      this.properties.iconSelectionGrid
    );
    this.contentContainer.add([this.iconSelectionGrid, label]);
  }
}
