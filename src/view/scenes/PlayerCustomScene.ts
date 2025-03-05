import { Scene } from 'phaser';
import PlayerCustomModal from '../gameObjects/ui/PlayerCustomModal';

export default class PlayerCustomScene extends Scene {
  background: Phaser.GameObjects.Rectangle;
  modal: PlayerCustomModal;

  constructor() {
    super('PlayerCustom')
  }

  
  create() {
    this.background = new Phaser.GameObjects.Rectangle(this, 
        0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0,0)
    this.add.existing(this.background)
    // this.background.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => this.scene.stop('PlayerCustom'))
    this.createModal()
  }

  createModal() {
    this.modal = new PlayerCustomModal(this, this.scale.width * 0.75/2, this.scale.height/2)
    this.add.existing(this.modal)
  }
}
