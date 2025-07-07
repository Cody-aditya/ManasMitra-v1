import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  PictureInPicture,
  Settings,
  Subtitles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';
import { SettingsMenu } from './SettingsMenu';
import { SubtitleMenu } from './SubtitleMenu';

interface VideoControlsProps {
  containerRef: React.RefObject<HTMLDivElement>;
  visible: boolean;
}

export const VideoControls: React.FC<VideoControlsProps> = ({ containerRef, visible }) => {
  const {
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    playbackRate,
    isFullscreen,
    setIsFullscreen,
    isPiP,
    setIsPiP,
    videoRef,
    nextVideo,
    previousVideo,
    currentVideoIndex,
    videoList,
  } = useVideo();

  const [showSettings, setShowSettings] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number, totalDuration?: number) => {
    const totalSeconds = Math.floor(time);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Determine if we should show hours based on total duration
    const shouldShowHours = (totalDuration || duration) >= 3600;

    if (shouldShowHours) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const getDisplayTime = () => {
    if (showRemainingTime) {
      const remaining = duration - currentTime;
      return `-${formatTime(remaining, duration)}`;
    } else {
      return formatTime(currentTime, duration);
    }
  };

  const toggleTimeDisplay = () => {
    setShowRemainingTime(!showRemainingTime);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skipForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(currentTime + 10, duration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(currentTime - 10, 0);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (isFullscreen) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;

    try {
      if (isPiP) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-Picture error:', error);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Settings Menu */}
      {showSettings && (
        <SettingsMenu
          onClose={() => setShowSettings(false)}
          playbackRate={playbackRate}
        />
      )}

      {/* Subtitle Menu */}
      {showSubtitles && (
        <SubtitleMenu onClose={() => setShowSubtitles(false)} />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* Controls */}
      <div className="relative z-10 p-4 space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div
            ref={progressRef}
            className="w-full h-2 bg-gray-600 rounded-full cursor-pointer group"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-150 group-hover:bg-blue-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-white">
            <button
              onClick={toggleTimeDisplay}
              className="hover:text-blue-400 transition-colors duration-200 font-mono"
              title={showRemainingTime ? 'Show elapsed time' : 'Show remaining time'}
            >
              {getDisplayTime()}
            </button>
            <span className="font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Previous/Next */}
            <button
              onClick={previousVideo}
              disabled={currentVideoIndex <= 0}
              className={`p-2 rounded-lg transition-colors ${
                currentVideoIndex <= 0
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Skip backward */}
            <button
              onClick={skipBackward}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </button>

            {/* Skip forward */}
            <button
              onClick={skipForward}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            {/* Next */}
            <button
              onClick={nextVideo}
              disabled={currentVideoIndex >= videoList.length - 1}
              className={`p-2 rounded-lg transition-colors ${
                currentVideoIndex >= videoList.length - 1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <VolumeIcon className="w-6 h-6" />
              </button>
              
              {showVolumeSlider && (
                <div
                  className="flex items-center space-x-2 bg-black/50 rounded-lg p-2"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white text-sm min-w-[3ch]">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Subtitles */}
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <Subtitles className="w-6 h-6" />
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>

            {/* Picture-in-Picture */}
            <button
              onClick={togglePiP}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <PictureInPicture className="w-6 h-6" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-6 h-6" />
              ) : (
                <Maximize className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};