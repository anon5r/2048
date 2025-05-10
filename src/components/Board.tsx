import React from 'react';
import type { GameState } from '../game/Game2048';
import '../styles/Board.css';
import { useWindowSize } from '../hooks/useWindowSize';
import SizeWarning from './SizeWarning';

interface BoardProps {
  gameState: GameState;
}

const Board: React.FC<BoardProps> = ({ gameState }) => {
  const { board } = gameState;
  const size = board.length;
  const { width, height } = useWindowSize();

  // Calculate minimum dimensions based on the smallest tile size (from media queries)
  // For screens under 300px, tile size is 50px and grid spacing is 5px
  // const minBoardWidth = 4 * (50 + 5) + 5; // 4 tiles across + spacing
  // const minBoardHeight = 4 * (50 + 5) + 5; // 4 tiles down + spacing

  // Calculate the actual minimum dimensions needed
  // Board width: 4 tiles of 50px each + 5 grid spacings of 5px each = 225px
  // Board height: 4 tiles of 50px each + 5 grid spacings of 5px each = 225px
  const minWidth = 225;
  const minHeight = 225;

  // Check if the window is too small
  const isTooSmall = width < minWidth || height < minHeight;

  // Create the grid cells (empty background cells)
  const renderGridCells = () => {
    const cells = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        cells.push(
          <div 
            key={`cell-${row}-${col}`} 
            className="grid-cell"
            style={{
              top: `calc(${row} * (var(--tile-size) + var(--grid-spacing)) + var(--grid-spacing))`,
              left: `calc(${col} * (var(--tile-size) + var(--grid-spacing)) + var(--grid-spacing))`,
            }}
          />
        );
      }
    }
    return cells;
  };

  // Create the tiles
  const renderTiles = () => {
    const tiles = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const tile = board[row][col];
        if (tile) {
          tiles.push(
            <div
              key={`tile-${tile.id}`}
              className={`tile tile-${tile.value} ${tile.isNew ? 'tile-new' : ''} ${tile.mergedFrom ? 'tile-merged' : ''}`}
              style={{
                top: `calc(${tile.row} * (var(--tile-size) + var(--grid-spacing)) + var(--grid-spacing))`,
                left: `calc(${tile.col} * (var(--tile-size) + var(--grid-spacing)) + var(--grid-spacing))`,
              }}
            >
              <div className="tile-inner">{tile.value}</div>
            </div>
          );
        }
      }
    }

    return tiles;
  };

  return (
    <>
      {isTooSmall ? (
        <SizeWarning minWidth={minWidth} minHeight={minHeight} />
      ) : (
        <div className="board-container">
          <div className="grid-container">
            <div className="grid-background">
              {renderGridCells()}
            </div>
            <div className="tile-container">
              {renderTiles()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
