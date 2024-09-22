import { Scene } from 'phaser';
import Board from '../gameObjects/Board';

export class Game extends Scene
{
    board: Board
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor('#b88f77');
        this.addBoard();
    }
    
    addBoard() {
        const boardSize = 500;
        this.board = new Board(this, (this.scale.width - boardSize)/2, (this.scale.height - boardSize)/2, boardSize);
        this.add.existing(this.board)
    }
}