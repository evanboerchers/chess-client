import { buttonDefaultText } from '../../style/textStyle';
import ThemeManager from '../../style/ThemeManager';

export interface ButtonProperties {
  text?: string;
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  background?: Phaser.GameObjects.Sprite | GeneratedBackgroundProperties;
  highlight?: Phaser.GameObjects.Sprite | GeneratedBackgroundProperties;
  hitArea?: Phaser.Geom.Rectangle | Phaser.Geom.Circle | Phaser.Geom.Polygon;
  callback?: () => any;
}

interface GeneratedBackgroundProperties {
  width?: number,
  height?: number,
  radius?: number
}

export default class Button extends Phaser.GameObjects.Container {
  _background: Phaser.GameObjects.Sprite;
  _highlight: Phaser.GameObjects.Sprite;
  text: Phaser.GameObjects.Text;
  hitArea: Phaser.Geom.Rectangle | Phaser.Geom.Circle | Phaser.Geom.Polygon;
  callback: () => any;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    properties: ButtonProperties,
    name?: string
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.name = name ?? 'button';
    this.text = this.scene.add
      .text(
        0,
        0,
        properties.text ?? '',
        properties.textStyle ?? buttonDefaultText
      )
      .setOrigin(0.5);
    if (properties.background instanceof Phaser.GameObjects.Sprite) {
      this._background = properties.background
    } else {
      this._background = this.generateBackground(properties.background);
    }
    if (properties.highlight instanceof Phaser.GameObjects.Sprite) {
      this._highlight= properties.highlight
    } else {
      this._highlight= this.generateHighlight({...properties.background, ...properties.highlight});
    }
      this.hitArea = properties.hitArea ?? this.createHitArea();
    this.add([this._background, this._highlight, this.text]);
    this.callback = properties.callback ?? (() => {});
    this.createEvents();
    this.default()
  }

  generateBackground(properties?: GeneratedBackgroundProperties): Phaser.GameObjects.Sprite {
    const width = properties?.width ?? 80;
    const height = properties?.height ?? 30;
    const radius = properties?.radius ?? 10;
    const background = this.scene.add.graphics();
    background.lineStyle(4, ThemeManager.getTheme().ui.button.default.stroke);
    background.strokeRoundedRect(4, 4, width, height, radius);
    background.fillStyle(ThemeManager.getTheme().ui.button.default.fill);
    background.fillRoundedRect(4, 4, width, height, radius);
    const texture = `${this.name}-background-texture-${Math.random() * 100}`;
    background.generateTexture(texture, width + 8, height + 8);
    background.destroy();
    return this.scene.add.sprite(0, 0, texture).setOrigin(0.5).setName(texture);
  }

  generateHighlight(properties?: GeneratedBackgroundProperties): Phaser.GameObjects.Sprite {
    const width = properties?.width ?? 80;
    const height = properties?.height ?? 30;
    const radius = properties?.radius ?? 10;
    const background = this.scene.add.graphics();
    background.lineStyle(4, ThemeManager.getTheme().ui.button.highlight.stroke);
    background.strokeRoundedRect(4, 4, width, height, radius);
    background.fillStyle(ThemeManager.getTheme().ui.button.highlight.fill);
    background.fillRoundedRect(4, 4, width, height, radius);
    const texture = `${this.name}-highlight-texture-${Math.random() * 100}`;
    background.generateTexture(texture, width + 8, height + 8);
    background.destroy();
    return this.scene.add.sprite(0, 0, texture).setOrigin(0.5).setName(texture);
  }

  default() {
    console.log("default")
    this._highlight.visible = false
    this._background.visible = true
  }
  
  highlight() {
    console.log("highlight")
    this._highlight.visible = true
    this._background.visible = false
  }

  createHitArea(): Phaser.Geom.Rectangle {
    const width = 80;
    const height = 30;
    return new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height);
  }

  createEvents() {
    this._background.setInteractive({
      useHandCursor: true,
    });
    this._highlight.setInteractive({
      useHandCursor: true,
    });
    this._highlight.on(Phaser.Input.Events.POINTER_DOWN, this.callback);
    this._background.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.highlight()}
    );
    this._highlight.on(Phaser.Input.Events.POINTER_OUT, () => {this.default()})
  }
}
