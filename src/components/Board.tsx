import React from 'react';
import type { GameState } from '../game/Game2048';
import '../styles/Board.css';

interface BoardProps {
  gameState: GameState;
}

const Board: React.FC<BoardProps> = ({ gameState }) => {
  const { board } = gameState;
  const size = board.length;

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
  );
};

export default Board;
