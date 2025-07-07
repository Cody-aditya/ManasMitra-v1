import { useEffect } from 'react';
import { useVideo } from '../contexts/VideoContext';

export const useKeyboardShortcuts = () => {
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
    setPlaybackRate,
    isFullscreen,
    setIsFullscreen,
    videoRef,
    nextVideo,
    previousVideo,
    setShowControls,
  } = useVideo();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

      // Prevent default behavior for handled keys
      const handledKeys = [
        'Space',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'KeyF',
        'KeyM',
        'KeyN',
        'KeyP',
        'KeyD',
        'KeyS',
        'Digit0',
        'Digit1',
        'Digit2',
        'Digit3',
        'Digit4',
        'Digit5',
        'Digit6',
        'Digit7',
        'Digit8',
        'Digit9',
      ];

      if (handledKeys.includes(e.code)) {
        e.preventDefault();
        setShowControls(true);
      }

      switch (e.code) {
        case 'Space':
          setIsPlaying(!isPlaying);
          break;

        case 'ArrowLeft':
          // Skip back 5 seconds
          const newTimeBack = Math.max(currentTime - 5, 0);
          video.currentTime = newTimeBack;
          setCurrentTime(newTimeBack);
          break;

        case 'ArrowRight':
          // Skip forward 5 seconds
          const newTimeForward = Math.min(currentTime + 5, duration);
          video.currentTime = newTimeForward;
          setCurrentTime(newTimeForward);
          break;

        case 'ArrowUp':
          // Increase volume
          const newVolumeUp = Math.min(volume + 0.1, 1);
          setVolume(newVolumeUp);
          if (isMuted) setIsMuted(false);
          break;

        case 'ArrowDown':
          // Decrease volume
          const newVolumeDown = Math.max(volume - 0.1, 0);
          setVolume(newVolumeDown);
          break;

        case 'KeyM':
          setIsMuted(!isMuted);
          break;

        case 'KeyF':
          // Toggle fullscreen
          if (isFullscreen) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;

        case 'KeyN':
          nextVideo();
          break;

        case 'KeyP':
          previousVideo();
          break;

        case 'KeyD':
          // Increase playback speed
          const newSpeedUp = Math.min(playbackRate + 0.25, 10);
          setPlaybackRate(newSpeedUp);
          break;

        case 'KeyS':
          // Decrease playback speed
          const newSpeedDown = Math.max(playbackRate - 0.25, 0.25);
          setPlaybackRate(newSpeedDown);
          break;

        case 'Digit0':
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
          // Jump to percentage of video
          const digit = parseInt(e.code.replace('Digit', ''));
          const percentage = digit / 10;
          const newTime = duration * percentage;
          video.currentTime = newTime;
          setCurrentTime(newTime);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
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
    setPlaybackRate,
    isFullscreen,
    setIsFullscreen,
    videoRef,
    nextVideo,
    previousVideo,
    setShowControls,
  ]);
};