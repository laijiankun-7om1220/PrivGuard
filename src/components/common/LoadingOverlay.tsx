import React from 'react';
import './LoadingOverlay.css';

interface LoadingOverlayProps {
  visible: boolean;
  text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  text = 'AI 正在分析中，请稍候...',
}) => {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="ai-loader">
          <div className="ai-brain">
            <div className="brain-circle circle-1"></div>
            <div className="brain-circle circle-2"></div>
            <div className="brain-circle circle-3"></div>
            <div className="brain-center"></div>
          </div>
          <div className="ai-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
            <div className="particle particle-6"></div>
          </div>
        </div>
        <div className="loading-text">{text}</div>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
};
