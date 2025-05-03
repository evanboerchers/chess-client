import { GameState } from "@evanboerchers/chess-core";

export interface ScenarioSave {
    name: string;
    data: GameState;
}

export interface Scenarios {
    scenarios: string[]
}

export interface GameWindowInterface {
    getChessGameState: () => GameState
    loadChessGameState: (gameState: GameState) => boolean
}
