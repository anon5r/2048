import { describe, it, expect, beforeEach } from 'vitest';
import { Game2048, Direction } from '../../game/Game2048.ts';
import type { TestGame2048 } from './TestGame2048';

describe('Game2048', () => {
  let game: Game2048;

  beforeEach(() => {
    game = new Game2048();
    // Start a new game to initialize the board
    game.newGame();
  });

  it('should initialize a new game with two random tiles', () => {
    const state = game.getState();

    // Count the number of tiles on the board
    let tileCount = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (state.board[row][col]) {
          tileCount++;
        }
      }
    }

    expect(tileCount).toBe(2);
    expect(state.score).toBe(0);
    expect(state.over).toBe(false);
    expect(state.won).toBe(false);
  });

  it('should move tiles in the specified direction', () => {
    // Create a game with a controlled board state
    const controlledGame = new Game2048();
    controlledGame.newGame();

    // Get the initial state to check if tiles moved
    const initialState = JSON.stringify(controlledGame.getState().board);

    // Move in some direction
    const moved = controlledGame.move(Direction.LEFT);

    // If the move was valid, the board should have changed
    if (moved) {
      const newState = JSON.stringify(controlledGame.getState().board);
      expect(newState).not.toBe(initialState);
    }
  });

  it('should merge tiles with the same value', () => {
    // This test is more complex as we need to set up a specific board state
    // We'll use a mock to test the merge functionality

    // Create a game with a controlled board
    const mockGame = new Game2048();

    // Access private state for testing
    const gameAny = mockGame as unknown as TestGame2048;

    // Set up a board with two adjacent tiles of the same value
    gameAny.state.board = Array(4).fill(null).map(() => Array(4).fill(null));
    gameAny.state.board[0][0] = { id: 1, value: 2, row: 0, col: 0 };
    gameAny.state.board[0][1] = { id: 2, value: 2, row: 0, col: 1 };

    // Move left to merge the tiles
    const moved = mockGame.move(Direction.LEFT);

    // Check if the move was valid
    expect(moved).toBe(true);

    // Check if the tiles merged
    const state = mockGame.getState();
    expect(state.board[0][0]?.value).toBe(4);
    expect(state.board[0][1]).toBe(null);
    expect(state.score).toBe(4);
  });

  it('should add a new tile after a valid move', () => {
    // Create a game with a controlled board
    const mockGame = new Game2048();

    // Access private state for testing
    const gameAny = mockGame as unknown as TestGame2048;

    // Set up a board with one tile
    gameAny.state.board = Array(4).fill(null).map(() => Array(4).fill(null));
    gameAny.state.board[0][0] = { id: 1, value: 2, row: 0, col: 0 };

    // Count initial tiles
    let initialTileCount = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (gameAny.state.board[row][col]) {
          initialTileCount++;
        }
      }
    }

    // Move right (valid move as the tile will move)
    mockGame.move(Direction.RIGHT);

    // Count tiles after move
    let newTileCount = 0;
    const state = mockGame.getState();
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (state.board[row][col]) {
          newTileCount++;
        }
      }
    }

    // Should have one more tile after the move
    expect(newTileCount).toBe(initialTileCount + 1);
  });

  it('should detect when the game is over', () => {
    // Create a game with a controlled board
    const mockGame = new Game2048();

    // Access private state for testing
    const gameAny = mockGame as unknown as TestGame2048;

    // Set up a board that is full and no merges are possible
    gameAny.state.board = Array(4).fill(null).map(() => Array(4).fill(null));

    // Fill the board with alternating values that can't be merged
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = (row + col) % 2 === 0 ? 2 : 4;
        gameAny.state.board[row][col] = { id: row * 4 + col, value, row, col };
      }
    }

    // Make sure adjacent tiles have different values
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (col < 3) {
          expect(gameAny.state.board[row][col]!.value).not.toBe(gameAny.state.board[row][col + 1]!.value);
        }
        if (row < 3) {
          expect(gameAny.state.board[row][col]!.value).not.toBe(gameAny.state.board[row + 1][col]!.value);
        }
      }
    }

    // Try to move in all directions
    mockGame.move(Direction.UP);
    mockGame.move(Direction.RIGHT);
    mockGame.move(Direction.DOWN);
    mockGame.move(Direction.LEFT);

    // Directly call checkGameOver since the move method only checks if a valid move was made
    gameAny.state.over = gameAny.checkGameOver();

    // Game should be over
    const state = mockGame.getState();
    expect(state.over).toBe(true);
  });

  it('should detect when the player has won', () => {
    // Create a game with a controlled board
    const mockGame = new Game2048();

    // Access private state for testing
    const gameAny = mockGame as unknown as TestGame2048;

    // Set up a board with two 1024 tiles next to each other
    gameAny.state.board = Array(4).fill(null).map(() => Array(4).fill(null));
    gameAny.state.board[0][0] = { id: 1, value: 1024, row: 0, col: 0 };
    gameAny.state.board[0][1] = { id: 2, value: 1024, row: 0, col: 1 };

    // Move left to merge the tiles to 2048
    mockGame.move(Direction.LEFT);

    // Check if the player has won
    const state = mockGame.getState();
    expect(state.won).toBe(true);
    expect(state.board[0][0]?.value).toBe(2048);
  });
});
