import { useEffect, useRef } from 'react';
import { Direction, Game2048 } from '../game/Game2048';

// Minimum swipe distance (in pixels)
const MIN_SWIPE_DISTANCE = 30;

interface TouchPosition {
  x: number;
  y: number;
}

export const useGameControls = (game: Game2048, updateGame: () => void) => {
  // Store touch start position
  const touchStartRef = useRef<TouchPosition | null>(null);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let moved = false;

      switch (event.key) {
        case 'ArrowUp':
          moved = game.move(Direction.UP);
          break;
        case 'ArrowRight':
          moved = game.move(Direction.RIGHT);
          break;
        case 'ArrowDown':
          moved = game.move(Direction.DOWN);
          break;
        case 'ArrowLeft':
          moved = game.move(Direction.LEFT);
          break;
        default:
          return; // Ignore other keys
      }

      if (moved) {
        event.preventDefault();
        updateGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [game, updateGame]);

  // Handle touch controls
  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY
      };
    }
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY
    };

    const dx = touchEnd.x - touchStartRef.current.x;
    const dy = touchEnd.y - touchStartRef.current.y;
    
    // Reset touch start
    touchStartRef.current = null;

    // Determine if the swipe was long enough
    if (Math.abs(dx) < MIN_SWIPE_DISTANCE && Math.abs(dy) < MIN_SWIPE_DISTANCE) {
      return;
    }

    let moved = false;

    // Determine swipe direction
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 0) {
        moved = game.move(Direction.RIGHT);
      } else {
        moved = game.move(Direction.LEFT);
      }
    } else {
      // Vertical swipe
      if (dy > 0) {
        moved = game.move(Direction.DOWN);
      } else {
        moved = game.move(Direction.UP);
      }
    }

    if (moved) {
      event.preventDefault();
      updateGame();
    }
  };

  // Prevent scrolling when swiping inside the game
  const handleTouchMove = (event: React.TouchEvent) => {
    if (touchStartRef.current) {
      event.preventDefault();
    }
  };

  return {
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove
  };
};