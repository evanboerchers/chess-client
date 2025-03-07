import { io } from 'socket.io-client';
import { ServerToClientEvents, GameSocket } from './server.types';
import { Move } from '../model/board/board.types';
import { GameOutcome, GameState } from '@evanboerchers/chess-core';

export class MultiplayerService {
  private socket: GameSocket | null = null;
  private readonly url: string;
  private readonly eventHandlers: Map<keyof ServerToClientEvents, Function[]> =
    new Map();

  constructor(url: string) {
    this.url = url;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.url, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to game server');
        this.registerServerEvents();
        resolve();
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('Connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason: any) => {
        console.log('Disconnected:', reason);
      });
    });
  }

  private registerServerEvents() {
    if (!this.socket) return;

    // Register all server-to-client event handlers
    this.socket.on('queueJoined', () => this.emit('queueJoined'));
    this.socket.on('gameStarted', (state: GameState) =>
      this.emit('gameStarted', state)
    );
    this.socket.on('makeMove', () => this.emit('makeMove'));
    this.socket.on('waiting', () => this.emit('waiting'));
    this.socket.on('moveMade', (move: Move, state: GameState) =>
      this.emit('moveMade', move, state)
    );
    this.socket.on('drawOffered', () => this.emit('drawOffered'));
    this.socket.on('gameOver', (result: GameOutcome) =>
      this.emit('gameOver', result)
    );
    this.socket.on('drawDeclined', () => this.emit('drawDeclined'));
  }

  private emit(event: keyof ServerToClientEvents, ...args: any[]) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(...args));
    }
  }

  // Generic event registration method
  public on<T extends keyof ServerToClientEvents>(
    event: T,
    handler: ServerToClientEvents[T]
  ): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
  }

  // Generic event unregistration method
  public off<T extends keyof ServerToClientEvents>(
    event: T,
    handler: ServerToClientEvents[T]
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Client to Server events
  public joinQueue(playerName: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('joinQueue', playerName);
  }

  public makeMove(move: Move): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('makeMove', move);
  }

  public resign(): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('resign');
  }

  public offerDraw(): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('offerDraw');
  }

  public acceptDraw(): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('drawAccepted');
  }

  public declineDraw(): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('drawDeclined');
  }

  // Connection management
  public disconnect(): void {
    this.socket?.disconnect();
    this.eventHandlers.clear();
    this.socket = null;
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public removeAllListeners(): void {
    this.eventHandlers.clear();
    this.socket?.removeAllListeners();
  }

  // Error handling with custom error types
  // public onError(handler: (error: Error) => void): void {
  //     this.socket?.on('error', handler);
  // }
}

// Custom error types for better error handling
export class SocketConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SocketConnectionError';
  }
}

export class SocketEventError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SocketEventError';
  }
}
