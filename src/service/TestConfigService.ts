import { ChessGame } from "@evanboerchers/chess-core"
import ParamsService from "./ParamService"
import { ParamKey } from "./params.types"

class TestConfigService {

    constructor() {
    }

    isTestScenario() {
        return !!ParamsService.getParam(ParamKey.TEST_SCENARIO)
    }

    loadTestScenarioIntoModel(gameModel: ChessGame): boolean {
        return false
    }
    saveTestScenario(gameModel: ChessGame, name?: string) {
    }
}

const testConfigService = new TestConfigService()
export default testConfigService