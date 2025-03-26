import { PieceColour } from "@evanboerchers/chess-core";
import GameSidebarScene from "../view/scenes/sidebar/GameSidebarScene";

export default class GameSideBarInputController {
    sidebar: GameSidebarScene 
    
    constructor(sidebar: GameSidebarScene) {
        this.sidebar = sidebar
    }

    setupButtonHandlers(colour: PieceColour, drawHandler: () => void, resignHandler: () => void) {
        colour === PieceColour.WHITE ? this.sidebar.setWhiteButtonHandlers(drawHandler, resignHandler) :
        this.sidebar.setBlackButtonHandlers(drawHandler, resignHandler)
    }

    showDrawOfferTo(colour: PieceColour, handler: () => void) {
    }
}