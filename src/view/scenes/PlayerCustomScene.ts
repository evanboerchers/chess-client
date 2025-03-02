import { Scene } from 'phaser';

export default class PlayerCustomScene extends Scene {
 

  constructor() {
    super('PlayerCustom')
  }

  background: Phaser.GameObjects.Rectangle;

  create() {
    this.background = new Phaser.GameObjects.Rectangle(this, 
        0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0,0)
    this.add.existing(this.background)
    this.background.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => this.scene.stop('PlayerCustom'))
  }
}
