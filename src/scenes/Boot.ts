import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        
        // Black Pieces
        this.load.image('blackPawn', 'assets/b_pawn.webp');
        this.load.image('blackRook', 'assets/b_rook.webp');
        this.load.image('blackKnight', 'assets/b_knight.webp');
        this.load.image('blackBishop', 'assets/b_bishop.webp');
        this.load.image('blackQueen', 'assets/b_queen.webp');
        this.load.image('blackKing', 'assets/b_king.webp');

        // White Pieces
        this.load.image('whitePawn', 'assets/w_pawn.webp');
        this.load.image('whiteRook', 'assets/w_rook.webp');
        this.load.image('whiteKnight', 'assets/w_knight.webp');
        this.load.image('whiteBishop', 'assets/w_bishop.webp');
        this.load.image('whiteQueen', 'assets/w_queen.webp');
        this.load.image('whiteKing', 'assets/w_king.webp');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
