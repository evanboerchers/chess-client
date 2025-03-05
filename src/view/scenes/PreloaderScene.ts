import { Scene } from 'phaser';
import { defaultInitData } from './sidebar/GameSidebarScene';

export default class PreloaderScene extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets/board');
    
        // Black Pieces
        this.load.image('blackPawn', 'b_pawn.webp');
        this.load.image('blackRook', 'b_rook.webp');
        this.load.image('blackKnight', 'b_knight.webp');
        this.load.image('blackBishop', 'b_bishop.webp');
        this.load.image('blackQueen', 'b_queen.webp');
        this.load.image('blackKing', 'b_king.webp');
        
        // White Pieces
        this.load.image('whitePawn', 'w_pawn.webp');
        this.load.image('whiteRook', 'w_rook.webp');
        this.load.image('whiteKnight', 'w_knight.webp');
        this.load.image('whiteBishop', 'w_bishop.webp');
        this.load.image('whiteQueen', 'w_queen.webp');
        this.load.image('whiteKing', 'w_king.webp');
        
        this.load.setPath('assets/profile');
        this.load.image('profile1', 'profile_1.webp');
        this.load.image('profile2', 'profile_2.webp');
        this.load.image('profile3', 'profile_3.webp');
        this.load.image('profile4', 'profile_3.webp');
        this.load.image('profile5', 'profile_3.webp');
        this.load.image('profile6', 'profile_3.webp');
        this.load.image('profile7', 'profile_3.webp');
        this.load.image('profile8', 'profile_3.webp');
        this.load.image('profile9', 'profile_3.webp');
        this.load.image('profile10', 'profile_3.webp');
    }
    
    create ()
    {
        this.scene.start('Board');
        // this.scene.start('MenuSidebar')
        this.scene.start('QueueSidebar')
        this.scene.start('PlayerCustom')
        // this.scene.start('GameSidebar', defaultInitData);
    }
}
