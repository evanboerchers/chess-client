import { GameState } from "@evanboerchers/chess-core"
import gameController from "../control/GameController"
import { GameWindowInterface } from "../test-panel/test-panel.types"
import { ParamKey } from "./params.types"
import paramService from "./ParamService"

class TestService {
    isTestScenario(): boolean {
        if(paramService.getBooleanParam(ParamKey.TEST_SCENARIO)) return true
        return false
    }

    private setWindowGameInterface(): void {
        const gameInterface: GameWindowInterface = {
            getChessGameState: () => {return gameController.getGameState()},
            loadChessGameState: (gameState: GameState) => {
                gameController.loadGameState(gameState) 
                return true}
        }
        window.gameInterface = gameInterface
    }

    openTestPanel(): void {
        this.setWindowGameInterface()
        const popup = window.open('/test-panel/test-panel.html', 'GameTestConfig', 'width=800,height=600,resizable=yes,scrollbars=yes');
    if (!popup) {
        console.error('Popup blocked or failed to open');
    } else {
        console.log('Popup opened successfully');
    }
    }
}

const testService = new TestService()
export default testService