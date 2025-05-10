import React from 'react';
import '../styles/GameOver.css';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  // Generate the share text
  const shareText = `I scored ${score} points in 2048! Can you beat my score?`;
  const shareUrl = window.location.href;

  // Share on Twitter
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  // Share on Facebook
  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  };

  // Share on LINE (popular in Japan)
  const shareOnLine = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(lineUrl, '_blank');
  };

  return (
    <div className="game-over">
      <div className="game-over-container">
        <h2 className="game-over-title">Game Over!</h2>
        <p className="game-over-score">Your score: <strong>{score}</strong></p>
        
        <div className="share-container">
          <p className="share-text">Share your score:</p>
          <div className="share-buttons">
            <button className="share-button twitter" onClick={shareOnTwitter}>
              Twitter
            </button>
            <button className="share-button facebook" onClick={shareOnFacebook}>
              Facebook
            </button>
            <button className="share-button line" onClick={shareOnLine}>
              LINE
            </button>
          </div>
        </div>
        
        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;