import { Move } from "@evanboerchers/chess-core";

export interface Agent {
    callbacks: AgentCallbacks;
    handleOppMove(move: Move): void;
    handleOppResign(): void;
    handleOppDrawOffer(): void;
}

export interface AgentCallbacks {
    onMove: (move: Move) => void;
    onResign: () => void;
    onDrawOffer: () => void;
    onDrawAccepted: () => void;
    onDrawDeclined: () => void;
}