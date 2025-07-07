import React, { useEffect, useRef, useState } from 'react';
import { useVideo } from '../contexts/VideoContext';
import { VideoControls } from './VideoControls';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const VideoPlayer: React.FC = () => {
  const {
    currentVideo,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    playbackRate,
    setPlaybackRate,
    showControls,
    setShowControls,
    isFullscreen,
    setIsFullscreen,
    isPiP,
    setIsPiP,
    videoRef,
    activeSubtitle,
  } = useVideo();

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const [error, setError] = useState<string | null>(null);

  // Keyboard shortcuts
  useKeyboardShortcuts();

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying, setShowControls]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setError('Failed to load video. Please try a different file.');
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoRef, setDuration, setCurrentTime, setIsPlaying]);

  // Sync video properties
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = isMuted ? 0 : volume;
    video.playbackRate = playbackRate;

    if (isPlaying) {
      video.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, volume, isMuted, playbackRate, videoRef, setIsPlaying]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  // Picture-in-Picture handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePiPEnter = () => setIsPiP(true);
    const handlePiPLeave = () => setIsPiP(false);

    video.addEventListener('enterpictureinpicture', handlePiPEnter);
    video.addEventListener('leavepictureinpicture', handlePiPLeave);

    return () => {
      video.removeEventListener('enterpictureinpicture', handlePiPEnter);
      video.removeEventListener('leavepictureinpicture', handlePiPLeave);
    };
  }, [videoRef, setIsPiP]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleClick = () => {
    setShowControls(true);
  };

  if (!currentVideo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📹</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Video Selected
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please select a video from the Files tab to start playing
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Playback Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black ${
        isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'
      }`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={currentVideo.url}
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
      >
        {activeSubtitle && (
          <track
            kind="subtitles"
            src={activeSubtitle.url}
            srcLang={activeSubtitle.language}
            default
          />
        )}
        Your browser does not support the video tag.
      </video>

      <VideoControls
        containerRef={containerRef}
        visible={showControls}
      />
    </div>
  );
};