import { GameState, PieceColour } from '@evanboerchers/chess-core';
import PlayerPanel, { PanelProperties } from '../../gameObjects/ui/PlayerPanel';
import SidebarScene from './SidebarScene';
import { SceneNames } from '../scenes.enum';
import BoardScene from '../BoardScene';
import gameController from '../../../control/GameController';

export interface GameSideBarSceneData {
  whiteProps: PanelProperties;
  blackProps: PanelProperties;
}

export const defaultInitData: GameSideBarSceneData = {
  whiteProps: {
    bannerProps: {
      colour: PieceColour.WHITE,
      playerName: 'White Player',
      iconTexture: 'profile1',
    },
    showButtons: true,
  },
  blackProps: {
    bannerProps: {
      colour: PieceColour.BLACK,
      playerName: 'Black Player',
      iconTexture: 'profile2',
    },
    showButtons: true,
  },
};

export default class GameSidebarScene extends SidebarScene {
  initData: GameSideBarSceneData;
  whitePanel: PlayerPanel;
  blackPanel: PlayerPanel;

  constructor() {
    super(SceneNames.GAME_SIDEBAR);
  }

  init(data: GameSideBarSceneData) {
    this.initData = data;
    gameController.setGameSidebarScene(this);
  }

  create(): void {
    super.create();
    this.whitePanel = this.createPlayerPanel(
      0,
      this.scale.height / 2 + 200,
      this.initData.whiteProps
    );
    this.blackPanel = this.createPlayerPanel(
      0,
      this.scale.height / 2 - 200,
      this.initData.blackProps
    );
    this.contentContainer.add([this.whitePanel, this.blackPanel]);
  }

  private createPlayerPanel(
    x: number,
    y: number,
    props: PanelProperties
  ): PlayerPanel {
    const panel = new PlayerPanel(this, x, y, props);
    return panel;
  }

  public flip() {
    const whiteY = this.whitePanel.y;
    const blackY = this.blackPanel.y;
    this.whitePanel.y = blackY;
    this.blackPanel.y = whiteY;
  }

  setWhiteButtonHandlers(drawHandler: () => void, resignHandler: () => void) {
    this.whitePanel.drawHandler = drawHandler
    this.whitePanel.resignHandler = resignHandler
  }

  setBlackButtonHandlers(drawHandler: () => void, resignHandler: () => void) {
    this.blackPanel.drawHandler = drawHandler
    this.blackPanel.resignHandler = resignHandler
  }
}
