import React from 'react';
import '../styles/Header.css';

interface HeaderProps {
  score: number;
  onNewGame: () => void;
}

const Header: React.FC<HeaderProps> = ({ score, onNewGame }) => {
  return (
    <div className="header">
      <div className="title-container">
        <h1 className="title">2048</h1>
        <div className="subtitle">Join the tiles, get to <strong>2048!</strong></div>
      </div>
      <div className="scores-container">
        <div className="score-container">
          <div className="score-label">SCORE</div>
          <div className="score">{score}</div>
        </div>
      </div>
      <div className="above-game">
        <button className="new-game-button" onClick={onNewGame}>New Game</button>
      </div>
    </div>
  );
};

export default Header;