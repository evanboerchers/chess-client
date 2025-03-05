import { Scene } from 'phaser';
import { SceneNames } from './scenes.enum';

export default class BootScene extends Scene
{
    constructor ()
    {
        super(SceneNames.BOOT);
    }

    preload ()
    {
        
    }

    create ()
    {
        this.scene.start(SceneNames.PRELOADER);
    }
}
