import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Board from '../../../src/components/Board';
import type { GameState } from '../../game/Game2048.ts';

// Mock the useWindowSize hook
const mockUseWindowSize = vi.fn(() => ({ width: 800, height: 600 }));
vi.mock('../../../src/hooks/useWindowSize', () => ({
  useWindowSize: () => mockUseWindowSize()
}));

// Mock the SizeWarning component
vi.mock('../../../src/components/SizeWarning', () => ({
  default: () => <div data-testid="size-warning">Your screen is too small</div>
}));

describe('Board Component', () => {
  let mockGameState: GameState;

  beforeEach(() => {
    // Create a mock game state with a 4x4 board
    mockGameState = {
      board: Array(4).fill(null).map(() => Array(4).fill(null)),
      score: 0,
      won: false,
      over: false,
      tileIdCounter: 2
    };

    // Add a couple of tiles to the board
    mockGameState.board[0][0] = { id: 0, value: 2, row: 0, col: 0 };
    mockGameState.board[1][2] = { id: 1, value: 4, row: 1, col: 2 };
  });

  it('renders the board with correct tiles', () => {
    const { container } = render(<Board gameState={mockGameState} />);

    // Check that the board container is rendered
    const boardContainer = container.querySelector('.board-container');
    expect(boardContainer).toBeTruthy();

    // Check that the grid cells are rendered (should be 16 for a 4x4 board)
    const gridCells = container.querySelectorAll('.grid-cell');
    expect(gridCells.length).toBe(16);

    // Check that the tiles are rendered with correct values
    const tiles = container.querySelectorAll('.tile');
    expect(tiles.length).toBe(2); // We added 2 tiles to the board

    // Check that the tile values are displayed
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('renders tiles with correct positions', () => {
    const { container } = render(<Board gameState={mockGameState} />);

    // Get all tiles
    const tiles = container.querySelectorAll('.tile');

    // Check that the tiles have the correct positions
    // The first tile should be at position (0, 0)
    expect((tiles[0] as HTMLElement).style.top).toContain('0');
    expect((tiles[0] as HTMLElement).style.left).toContain('0');

    // The second tile should be at position (1, 2)
    expect((tiles[1] as HTMLElement).style.top).toContain('1');
    expect((tiles[1] as HTMLElement).style.left).toContain('2');
  });

  it('renders tiles with correct CSS classes for animations', () => {
    // Add animation classes to the tiles
    mockGameState.board[0][0]!.isNew = true;
    mockGameState.board[1][2]!.mergedFrom = [
      { id: 2, value: 2, row: 1, col: 2 },
      { id: 3, value: 2, row: 1, col: 3 }
    ];

    const { container } = render(<Board gameState={mockGameState} />);

    // Check that the tiles have the correct animation classes
    const newTile = container.querySelector('.tile-new');
    expect(newTile).toBeTruthy();
    expect(newTile?.textContent).toBe('2');

    const mergedTile = container.querySelector('.tile-merged');
    expect(mergedTile).toBeTruthy();
    expect(mergedTile?.textContent).toBe('4');
  });

  it('renders SizeWarning when window is too small', () => {
    // Mock the useWindowSize hook to return a small window size
    mockUseWindowSize.mockReturnValueOnce({ width: 200, height: 200 });

    const { container } = render(<Board gameState={mockGameState} />);

    // Check that the SizeWarning component is rendered
    expect(container.querySelector('.board-container')).toBeNull();
    expect(screen.getByTestId('size-warning')).toBeTruthy();
  });
});
