import React from 'react';
import { useVideo } from '../contexts/VideoContext';

interface SettingsMenuProps {
  onClose: () => void;
  playbackRate: number;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ onClose, playbackRate }) => {
  const { setPlaybackRate } = useVideo();

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 7.5, 10];

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    onClose();
  };

  return (
    <div className="absolute bottom-20 right-4 z-20">
      <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
        <h3 className="text-white font-medium mb-3">Playback Speed</h3>
        <div className="space-y-1">
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                playbackRate === speed
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              {speed}x {speed === 1 ? '(Normal)' : ''}
            </button>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-600">
          <p className="text-xs text-gray-400">
            Use 'D' key to increase speed, 'S' key to decrease speed
          </p>
        </div>
      </div>
    </div>
  );
};