import { GameWindowInterface } from "./test-panel/test-panel.types";

declare global {
    interface Window {
        gameInterface: GameWindowInterface
    }
}