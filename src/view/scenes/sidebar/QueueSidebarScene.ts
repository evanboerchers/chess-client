import { GameState, PieceColour } from '@evanboerchers/chess-core';
import PlayerBanner, { BannerProperties } from '../../gameObjects/ui/PlayerBanner';
import SidebarScene from './SidebarScene';
import Button, { ButtonProperties } from '../../gameObjects/ui/Button';
import playerService from '../../../service/PlayerService';
import multiplayerService from '../../../service/MultiplayerService';
import { menuInfoText } from '../../style/textStyle';
import { SceneNames } from '../scenes.enum';
import { GameSideBarSceneData } from './GameSidebarScene';
import { PlayerData } from '../../../service/server.types';
import { PanelProperties } from '../../gameObjects/ui/PlayerPanel';

export default class QueueSidebarScene extends SidebarScene {
  private queueContainer: Phaser.GameObjects.Container;
  private banner: PlayerBanner;
  private countText: Phaser.GameObjects.Text;
  private searchText: Phaser.GameObjects.Text;
  private button: Button;
  private dotCount: number;
  queued: boolean;

  constructor() {
    super('QueueSidebar');
  }

  create(): void {
    super.create();
    this.queueContainer = this.add.container(0, this.scale.height / 2);
    this.contentContainer.add(this.queueContainer);
    const connectionText = this.add.text(0, 0, 'Connecting', menuInfoText).setOrigin(0.5)
    this.animateDotText(connectionText)
    this.queueContainer.add(connectionText)
    multiplayerService.connect().then(() => {
      connectionText.destroy();
      this.createPostConnect();
    }
    )
  }

  createPostConnect(): void {
    this.createPlayerBanner();
    this.searchText = this.add
      .text(0, 25, 'Searching', menuInfoText)
      .setOrigin(0.5);
    this.countText = this.add
      .text(0, -4, 'Players in Queue: 0', menuInfoText)
      .setOrigin(0.5);
    this.createQueueButton();
    this.setToWaitState();
    this.queueContainer.add([
      this.banner,
      this.countText,
      this.searchText,
      this.button,
    ]);
    multiplayerService.on('queueCount', (count: number) => {
      this.countText.setText(`Players in Queue: ${count}`);
    });
    this.animateDotText(this.searchText);
    this.registerServerEvents();
    this.events.on('shutdown', () => {
      this.derigisterServerEvents();
    })
    this.events.on('destroy', () => {
      this.derigisterServerEvents();
    })
  }

  update(time: number, delta: number): void {
    if (this.banner) {
      this.banner.setPlayerName(playerService.getName());
      this.banner.setPlayerIcon(playerService.getIcon());
    }
  
  }

  createPlayerBanner() {
    this.banner = new PlayerBanner(this, 0, -100, {
      playerName: 'profile1',
      iconTexture: 'profile1',
      colour: PieceColour.WHITE,
    });
    this.add.existing(this.banner);
    }
    
  private launchPlayerCustomization = () => {
  this.scene.launch('PlayerCustom');
  }

  enablePlayerCustomization() {
    this.banner.background
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_DOWN, this.launchPlayerCustomization, this);
  }
  disablePlayerCustomization() {
    this.banner.background.disableInteractive().off(Phaser.Input.Events.POINTER_DOWN, this.launchPlayerCustomization, this)
  }

  createQueueButton() {
    const buttonProps: ButtonProperties = {
      text: 'Queue',
      callback: () => {
        this.handleQueueClick();
      },
    };
    this.button = new Button(this, 0, -40, buttonProps);
  }

  animateDotText(text: Phaser.GameObjects.Text) {
    this.dotCount = 0;
    const originalText = text.text
    const config = {
      delay: 500,
      callback: () => {
        this.dotCount = this.dotCount >= 3 ? 0 : this.dotCount + 1;
        const dots = Array(this.dotCount).fill('.').join('');
        text.setText(originalText + dots);
      },
      callbackScope: this,
      loop: true,
    }
    const timer = this.time.addEvent(config);
    text.once('destroy', () => timer.remove(false))
  }

  setToWaitState() {
    if(this.queued) {
      multiplayerService.leaveQueue();
    }
    this.queued = false;
    this.button.text.text = 'Queue';
    this.searchText.visible = false;
    this.enablePlayerCustomization();
  }
  
  setToQueuedState() {
    this.queued = true;
    this.button.text.text = 'Cancel';
    this.searchText.visible = true;
    this.disablePlayerCustomization();
  }

  private registerServerEvents() {
    multiplayerService.on('queueJoined', this.handleQueueJoined)
    multiplayerService.on('leftQueue', this.handleLeftQueue)
    multiplayerService.on('gameFound', this.handleGameFound)
  }
  
  private derigisterServerEvents() {
    multiplayerService.off('queueJoined', this.handleQueueJoined)
    multiplayerService.off('leftQueue', this.handleLeftQueue)
    multiplayerService.on('gameFound', this.handleGameFound)
  }
  
  private handleQueueJoined = () =>  {
    console.log("Queue Joined")
    this.setToQueuedState()
  }
  
  private handleLeftQueue = () => {
    console.log("Left Queue")
    this.setToWaitState()
  }

  private handleGameFound = (playerColour: PieceColour, oppData: PlayerData, state: GameState) => {
    console.log("Game Found")
    const isPlayerWhite = playerColour === PieceColour.WHITE
    const playerProps: PanelProperties = {
      bannerProps: {
        colour: playerColour,
        playerName: playerService.data.name,
        iconTexture: playerService.data.icon
      },
      showButtons: true
    }
    const oppProps: PanelProperties = {
      bannerProps: {
        colour: isPlayerWhite ? PieceColour.BLACK : PieceColour.WHITE,
        playerName: oppData.name,
        iconTexture: oppData.icon
      },
      showButtons: false
    } 
    const data: GameSideBarSceneData = {
      whiteProps: isPlayerWhite ? playerProps : oppProps,
      blackProps: !isPlayerWhite ? playerProps : oppProps
    }
    this.scene.start(SceneNames.GAME_SIDEBAR, data)
    
  }

  handleQueueClick() {
    if (this.queued) {
      console.log('cancel button clicked');
      multiplayerService.leaveQueue();
    } else {
      console.log('queue button clicked');
      multiplayerService.joinQueue();
    }
  }
}
