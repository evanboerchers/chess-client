import { Move } from "@evanboerchers/chess-core";
import { Agent, AgentCallbacks } from "./Agent";

export default class LocalAgent implements Agent {
    callbacks: AgentCallbacks;

    constructor(callbacks: AgentCallbacks) {
        this.callbacks = callbacks
    }

    handleOppMove(move: Move): void {
        throw new Error("Method not implemented.");
    }
    handleOppResign(): void {
        throw new Error("Method not implemented.");
    }
    handleOppDrawOffer(): void {
        throw new Error("Method not implemented.");
    }
}