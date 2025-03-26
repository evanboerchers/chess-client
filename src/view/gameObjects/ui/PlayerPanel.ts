import { panelButtonText } from '../../style/textStyle';
import ThemeManager from '../../style/ThemeManager';
import Button from './Button';
import PlayerBanner, { BannerProperties } from './PlayerBanner';

export interface PanelProperties {
  bannerProps: BannerProperties;
  showButtons: boolean;
}

export default class PlayerPanel extends Phaser.GameObjects.Container {
  private banner: PlayerBanner;
  private buttonContainer: Phaser.GameObjects.Container;
  private drawButton?: Phaser.GameObjects.Container;
  private resignButton?: Phaser.GameObjects.Container;
  public resignHandler?: () => void
  public drawHandler?: () => void

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    properties: PanelProperties
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.banner = new PlayerBanner(this.scene, 0, -20, properties.bannerProps);
    this.buttonContainer = this.scene.add.container(0, 40);
    this.add([this.banner, this.buttonContainer]);
    if (properties.showButtons) {
      this.createButtons();
    }
  }

  private createButtons(): void {
    const drawProps = {
      text: 'Draw',
      callback: () => {
        this.drawHandler?.()
      },
    };
    this.drawButton = new Button(this.scene, 50, 0, drawProps);
    const resignProps = {
      text: 'Resign',
      callback: () => {
        this.resignHandler?.()
      },
    };
    this.resignButton = new Button(this.scene, -50, 0, resignProps);
    this.buttonContainer.add([this.drawButton, this.resignButton]);
  }
}
