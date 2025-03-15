import { ChessGame, GameState, Move, PieceColour } from "@evanboerchers/chess-core";
import multiplayerService from "../../service/MultiplayerService";
import BoardInputController from "../BoardInputController";
import gameController from "../GameController";
import { GameInstance } from "./GameInstance.types";

export default class MultiplayerGameInstance implements GameInstance {
    gameModel: ChessGame;
    boardInputController: BoardInputController
    localPlayer: PieceColour

    constructor(boardInputController: BoardInputController, gameModel?: ChessGame, localPlayer?: PieceColour) {
        this.gameModel = gameModel ?? new ChessGame()
        this.boardInputController = boardInputController
        this.localPlayer = localPlayer?? PieceColour.WHITE
        this.registerEvents()
        this.gameReady()
    }

    private registerEvents() {
        multiplayerService.on('moveMade', this.handleMoveMade)
        multiplayerService.on('waiting', this.handleWaiting)
        multiplayerService.on('makeMove', this.handleMakeMove)
    }

    private gameReady = () => {
        multiplayerService.gameReady();
    }

    private handleMoveMade = (move: Move, gameState: GameState) => {
        console.log('handling move made')
        this.gameModel.makeMove(move)
        gameController.handleMove(move)
    }

    private handleWaiting = () => {
        console.log('handling waiting') 
    }

    private handleMakeMove = () => {
        
        this.boardInputController.setupPieceSelection(this.gameModel.currentTurn, (move: Move) => {
            gameController.handleMove(move)
            multiplayerService.makeMove(move)
        })
    }
}