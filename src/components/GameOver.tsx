import React from 'react';
import '../styles/GameOver.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXTwitter, faFacebook, faBluesky} from '@fortawesome/free-brands-svg-icons';
import { faLine, faWhatsapp, faWeibo } from '@fortawesome/free-brands-svg-icons';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  // Generate the share text
  const shareText = `I scored ${score} points in 2048! Can you beat my score?`;
  const shareUrl = window.location.href;

  // Share on X (formerly Twitter)
  const shareOnX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(xUrl, '_blank');
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

  // Share on Bluesky
  const shareOnBluesky = () => {
    // Bluesky doesn't have a direct sharing API yet, so we'll open a new post with pre-filled text
    const blueskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(blueskyUrl, '_blank');
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Share on Weibo
  const shareOnWeibo = () => {
    const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
    window.open(weiboUrl, '_blank');
  };

  return (
    <div className="game-over">
      <div className="game-over-container">
        <h2 className="game-over-title">Game Over!</h2>
        <p className="game-over-score">Your score: <strong>{score}</strong></p>

        <div className="share-container">
          <p className="share-text">Share your score:</p>
          <div className="share-buttons">
            <button className="share-button x" onClick={shareOnX}>
              <FontAwesomeIcon icon={faXTwitter} /> X
            </button>
            <button className="share-button facebook" onClick={shareOnFacebook}>
              <FontAwesomeIcon icon={faFacebook} /> Facebook
            </button>
            <button className="share-button line" onClick={shareOnLine}>
              <FontAwesomeIcon icon={faLine} /> LINE
            </button>
            <button className="share-button bluesky" onClick={shareOnBluesky}>
              <FontAwesomeIcon icon={faBluesky} /> Bluesky
            </button>
            <button className="share-button whatsapp" onClick={shareOnWhatsApp}>
              <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
            </button>
            <button className="share-button weibo" onClick={shareOnWeibo}>
              <FontAwesomeIcon icon={faWeibo} /> Weibo
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
