// Game2048.ts - Core game logic for the 2048 game

// Direction constants for moves
export const Direction = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
} as const;

export type Direction = typeof Direction[keyof typeof Direction];

// Interface for a tile in the game
export interface Tile {
  id: number;      // Unique identifier for animation purposes
  value: number;   // The number on the tile (2, 4, 8, etc.)
  row: number;     // Current row position
  col: number;     // Current column position
  mergedFrom?: Tile[]; // Tiles that merged to form this tile (for animation)
  isNew?: boolean; // Whether this tile was just created
}

// Interface for position
export interface Position {
  row: number;
  col: number;
}

// Game state interface
export interface GameState {
  board: (Tile | null)[][];
  score: number;
  won: boolean;
  over: boolean;
  tileIdCounter: number;
}

export class Game2048 {
  private state: GameState;
  private size: number;

  constructor(size: number = 4) {
    this.size = size;
    this.state = this.getInitialState();
  }

  // Initialize a new game state
  private getInitialState(): GameState {
    const board = Array(this.size).fill(null).map(() => Array(this.size).fill(null));

    return {
      board,
      score: 0,
      won: false,
      over: false,
      tileIdCounter: 0
    };
  }

  // Get the current game state
  public getState(): GameState {
    return { ...this.state };
  }

  // Start a new game
  public newGame(): void {
    this.state = this.getInitialState();
    this.addRandomTile();
    this.addRandomTile();
  }

  // Add a random tile (2 or 4) to an empty cell
  private addRandomTile(): void {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4

      this.state.board[row][col] = {
        id: this.state.tileIdCounter++,
        value,
        row,
        col,
        isNew: true
      };
    }
  }

  // Get all empty cells on the board
  private getEmptyCells(): Position[] {
    const emptyCells: Position[] = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (!this.state.board[row][col]) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  // Check if the game is over (no moves possible)
  private checkGameOver(): boolean {
    // If there are empty cells, game is not over
    if (this.getEmptyCells().length > 0) {
      return false;
    }

    // Check if any adjacent tiles can be merged
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const tile = this.state.board[row][col];

        // Check right neighbor
        if (col < this.size - 1 && 
            tile?.value === this.state.board[row][col + 1]?.value) {
          return false;
        }

        // Check bottom neighbor
        if (row < this.size - 1 && 
            tile?.value === this.state.board[row + 1][col]?.value) {
          return false;
        }
      }
    }

    // No moves possible
    return true;
  }

  // Check if the player has won (reached 2048)
  // This method is currently unused but kept for potential future use
  /* private checkWin(): boolean {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state.board[row][col]?.value === 2048) {
          return true;
        }
      }
    }
    return false;
  } */

  // Prepare the board for a new move (clear merged flags)
  private prepareTiles(): void {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const tile = this.state.board[row][col];
        if (tile) {
          tile.mergedFrom = undefined;
          tile.isNew = false;
        }
      }
    }
  }

  // Find the farthest position a tile can move in a given direction
  private findFarthestPosition(row: number, col: number, direction: Direction): {
    farthest: Position;
    next: Position | null;
  } {
    let farthest: Position = { row, col };
    let next: Position | null = null;

    // Define direction vectors
    const vectors = {
      [Direction.UP]: { row: -1, col: 0 },
      [Direction.RIGHT]: { row: 0, col: 1 },
      [Direction.DOWN]: { row: 1, col: 0 },
      [Direction.LEFT]: { row: 0, col: -1 }
    };

    const vector = vectors[direction];

    // Look ahead one step at a time
    do {
      farthest = { row: next ? next.row : row, col: next ? next.col : col };
      next = {
        row: farthest.row + vector.row,
        col: farthest.col + vector.col
      };
    } while (
      this.withinBounds(next) && 
      !this.state.board[next.row][next.col]
    );

    // If next position has a tile, return it as the next position
    if (this.withinBounds(next) && this.state.board[next.row][next.col]) {
      return { farthest, next };
    }

    return { farthest, next: null };
  }

  // Check if a position is within the board boundaries
  private withinBounds(position: Position): boolean {
    return position.row >= 0 && position.row < this.size &&
           position.col >= 0 && position.col < this.size;
  }

  // Move a tile to a new position
  private moveTile(tile: Tile, newPosition: Position): void {
    this.state.board[tile.row][tile.col] = null;
    this.state.board[newPosition.row][newPosition.col] = tile;
    tile.row = newPosition.row;
    tile.col = newPosition.col;
  }

  // Perform a move in the specified direction
  public move(direction: Direction): boolean {
    if (this.state.over || this.state.won) {
      return false; // Can't move if game is over or won
    }

    this.prepareTiles();

    let moved = false;

    // Define the traversal order based on direction
    const traversals = this.buildTraversals(direction);

    // Traverse the grid and move tiles
    traversals.row.forEach(row => {
      traversals.col.forEach(col => {
        const tile = this.state.board[row][col];

        if (tile) {
          const { farthest, next } = this.findFarthestPosition(row, col, direction);

          // Only move if we can move to farthest
          if (farthest.row !== row || farthest.col !== col) {
            moved = true;
            this.moveTile(tile, farthest);
          }

          // Check if we can merge with the next tile
          if (next && this.state.board[next.row][next.col]) {
            const nextTile = this.state.board[next.row][next.col]!;

            // Merge if the values match and the next tile hasn't been merged already
            if (tile.value === nextTile.value && !nextTile.mergedFrom) {
              const mergedTile: Tile = {
                id: this.state.tileIdCounter++,
                value: tile.value * 2,
                row: next.row,
                col: next.col,
                mergedFrom: [tile, nextTile]
              };

              // Remove the original tiles
              this.state.board[tile.row][tile.col] = null;
              this.state.board[next.row][next.col] = mergedTile;

              // Update the score
              this.state.score += mergedTile.value;

              // Check if the player has won
              if (mergedTile.value === 2048) {
                this.state.won = true;
              }

              moved = true;
            }
          }
        }
      });
    });

    // If the move was valid, add a new random tile
    if (moved) {
      this.addRandomTile();

      // Check if the game is over
      if (this.checkGameOver()) {
        this.state.over = true;
      }
    }

    return moved;
  }

  // Build traversal orders based on direction
  private buildTraversals(direction: Direction): { row: number[], col: number[] } {
    const traversals = {
      row: Array(this.size).fill(0).map((_, i) => i),
      col: Array(this.size).fill(0).map((_, i) => i)
    };

    // For some directions, we need to process tiles in reverse order
    if (direction === Direction.DOWN) {
      traversals.row.reverse();
    }

    if (direction === Direction.RIGHT) {
      traversals.col.reverse();
    }

    return traversals;
  }
}
