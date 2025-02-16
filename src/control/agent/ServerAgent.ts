import { PieceColour } from "@evanboerchers/chess-core";
import { Agent, AgentCallbacks } from "./Agent.types";

export default class ServerAgent implements Agent {
    colour: PieceColour;
    callbacks: AgentCallbacks;
    waiting(): void {
        throw new Error("Method not implemented.");
    }
    makeMove(): void {
        throw new Error("Method not implemented.");
    }
    drawOffered(): void {
        throw new Error("Method not implemented.");
    }
}