import { Scene } from "phaser";


export default class BoardSquare extends Phaser.GameObjects.Rectangle {

    constructor(scene: Scene, x: number, y: number, width: number, color: number) {
        super(scene, x, y, width, width, color); 
        scene.add.existing(this);
    }
} 