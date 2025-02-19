import { Scene } from 'phaser';

export default class BootScene extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
