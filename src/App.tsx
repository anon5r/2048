import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { Game2048 } from './game/Game2048'
import Board from './components/Board'
import Header from './components/Header'
import GameOver from './components/GameOver'
import { useGameControls } from './hooks/useGameControls'

function App() {
  const [game] = useState(() => new Game2048())
  const [gameState, setGameState] = useState(game.getState())

  // Start a new game when the component mounts
  useEffect(() => {
    startNewGame();
  }, []);

  // Update the game state in the UI
  const updateGameState = useCallback(() => {
    setGameState({...game.getState()});
  }, [game]);

  // Start a new game
  const startNewGame = useCallback(() => {
    game.newGame();
    updateGameState();
  }, [game, updateGameState]);

  // Get touch controls
  const { handleTouchStart, handleTouchEnd, handleTouchMove } = useGameControls(game, updateGameState);

  return (
    <div 
      className="app-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <Header 
        score={gameState.score} 
        onNewGame={startNewGame} 
      />

      <Board gameState={gameState} />

      {gameState.over && (
        <GameOver 
          score={gameState.score} 
          onRestart={startNewGame} 
        />
      )}

      <div className="game-explanation">
        <p><strong>HOW TO PLAY:</strong> Use your <strong>arrow keys</strong> on desktop or <strong>swipe</strong> on mobile to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong></p>
      </div>
    </div>
  )
}

export default App
