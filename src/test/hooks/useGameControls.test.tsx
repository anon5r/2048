import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameControls } from '../../hooks/useGameControls.ts';
import { Game2048, Direction } from '../../game/Game2048.ts';

describe('useGameControls Hook', () => {
  let game: Game2048;
  let updateGame: () => void;
  
  beforeEach(() => {
    game = new Game2048();
    game.newGame();
    updateGame = vi.fn();
    
    // Mock game.move to always return true (valid move)
    vi.spyOn(game, 'move').mockImplementation(() => true);
  });
  
  it('should handle keyboard arrow keys', () => {
    renderHook(() => useGameControls(game, updateGame));
    
    // Simulate arrow key presses
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });
    expect(game.move).toHaveBeenCalledWith(Direction.UP);
    expect(updateGame).toHaveBeenCalled();
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });
    expect(game.move).toHaveBeenCalledWith(Direction.RIGHT);
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    });
    expect(game.move).toHaveBeenCalledWith(Direction.DOWN);
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });
    expect(game.move).toHaveBeenCalledWith(Direction.LEFT);
  });
  
  it('should ignore non-arrow keys', () => {
    renderHook(() => useGameControls(game, updateGame));
    
    // Simulate non-arrow key press
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });
    
    // game.move should not be called
    expect(game.move).not.toHaveBeenCalled();
    expect(updateGame).not.toHaveBeenCalled();
  });
  
  it('should handle touch swipes', () => {
    const { result } = renderHook(() => useGameControls(game, updateGame));
    
    // Simulate swipe right
    act(() => {
      const touchStartEvent = {
        touches: [{ clientX: 100, clientY: 200 }],
        preventDefault: vi.fn()
      } as unknown as React.TouchEvent;
      
      result.current.handleTouchStart(touchStartEvent);
      
      const touchEndEvent = {
        changedTouches: [{ clientX: 200, clientY: 200 }],
        preventDefault: vi.fn()
      } as unknown as React.TouchEvent;
      
      result.current.handleTouchEnd(touchEndEvent);
    });
    
    expect(game.move).toHaveBeenCalledWith(Direction.RIGHT);
    expect(updateGame).toHaveBeenCalled();
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Simulate swipe left
    act(() => {
      const touchStartEvent = {
        touches: [{ clientX: 200, clientY: 200 }],
        preventDefault: vi.fn()
      } as unknown as React.TouchEvent;
      
      result.current.handleTouchStart(touchStartEvent);
      
      const touchEndEvent = {
        changedTouches: [{ clientX: 100, clientY: 200 }],
        preventDefault: vi.fn()
      } as unknown as React.TouchEvent;
      
      result.current.handleTouchEnd(touchEndEvent);
    });
    
    expect(game.move).toHaveBeenCalledWith(Direction.LEFT);
    expect(updateGame).toHaveBeenCalled();
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Simulate swipe down
    act(() => {
      const touchStartEvent = {
        touches: [{ clientX: 200, clientY: 100 }],
        preventDefault: vi.fn()
      } as unknown as React.TouchEvent;
      
      result.current.handleTouchStart(touchStartEvent);
      
      const touchEndEvent = {
        changedTouches: [{ clientX: 200, clientY: 200 }],
        preventDefault: vi.fn()
      } as unknown as React.TouchEvent;
      
      result.current.handleTouchEnd(touchEndEvent);
    });
    
    expect(game.move).toHaveBeenCalledWith(Direction.DOWN);
    expect(updateGame).toHaveBeenCalled();
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Simulate swipe up
    act(() => {
      const touchStartEvent = {
        touches: [{ clientX: 200, clientY: 200 }],
        preventDefault: vi.fn()
      } as unknown as React.TouchEvent;
      
      result.current.handleTouchStart(touchStartEvent);
      
      const touchEndEvent = {
        changedTouches: [{ clientX: 200, clientY: 100 }],
        preventDefault: vi.fn()
      } as unknown as React.TouchEvent;
      
      result.current.handleTouchEnd(touchEndEvent);
    });
    
    expect(game.move).toHaveBeenCalledWith(Direction.UP);
    expect(updateGame).toHaveBeenCalled();
  });
  
  it('should ignore small swipes', () => {
    const { result } = renderHook(() => useGameControls(game, updateGame));
    
    // Simulate a small swipe (less than MIN_SWIPE_DISTANCE)
    act(() => {
      const touchStartEvent = {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: vi.fn()
      } as unknown as React.TouchEvent;
      
      result.current.handleTouchStart(touchStartEvent);
      
      const touchEndEvent = {
        changedTouches: [{ clientX: 110, clientY: 110 }],
        preventDefault: vi.fn()
      } as unknown as React.TouchEvent;
      
      result.current.handleTouchEnd(touchEndEvent);
    });
    
    // game.move should not be called for small swipes
    expect(game.move).not.toHaveBeenCalled();
    expect(updateGame).not.toHaveBeenCalled();
  });
  
  it('should prevent default on touch move', () => {
    const { result } = renderHook(() => useGameControls(game, updateGame));
    
    // Simulate touch start
    const touchStartEvent = {
      touches: [{ clientX: 100, clientY: 100 }],
      preventDefault: vi.fn()
    } as unknown as React.TouchEvent;
    
    act(() => {
      result.current.handleTouchStart(touchStartEvent);
    });
    
    // Simulate touch move
    const touchMoveEvent = {
      preventDefault: vi.fn()
    } as unknown as React.TouchEvent;
    
    act(() => {
      result.current.handleTouchMove(touchMoveEvent);
    });
    
    // preventDefault should be called to prevent scrolling
    expect(touchMoveEvent.preventDefault).toHaveBeenCalled();
  });
});