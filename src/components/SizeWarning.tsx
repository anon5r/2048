import React from 'react';
import '../styles/SizeWarning.css';

interface SizeWarningProps {
  minWidth: number;
  minHeight: number;
}

const SizeWarning: React.FC<SizeWarningProps> = ({ minWidth, minHeight }) => {
  return (
    <div className="size-warning">
      <div className="size-warning-container">
        <h2 className="size-warning-title">画面サイズが小さすぎます</h2>
        <p className="size-warning-message">
          ゲームを正しく表示するには、画面サイズを大きくしてください。
        </p>
        <p className="size-warning-details">
          推奨サイズ: 幅 {minWidth}px以上、高さ {minHeight}px以上
        </p>
      </div>
    </div>
  );
};

export default SizeWarning;