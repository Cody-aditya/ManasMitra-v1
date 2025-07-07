import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

interface VideoFile {
  id: string;
  name: string;
  url: string;
  duration?: number;
  size?: number;
}

interface Subtitle {
  id: string;
  name: string;
  url: string;
  language: string;
}

interface VideoContextType {
  // Video management
  currentVideo: VideoFile | null;
  videoList: VideoFile[];
  currentVideoIndex: number;
  setCurrentVideo: (video: VideoFile) => void;
  addVideos: (videos: VideoFile[]) => void;
  removeVideo: (id: string) => void;
  nextVideo: () => void;
  previousVideo: () => void;
  clearVideoList: () => void;
  
  // Playback state
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  
  // UI state
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  isPiP: boolean;
  setIsPiP: (pip: boolean) => void;
  
  // Subtitles
  subtitles: Subtitle[];
  activeSubtitle: Subtitle | null;
  setActiveSubtitle: (subtitle: Subtitle | null) => void;
  addSubtitle: (subtitle: Subtitle) => void;
  removeSubtitle: (id: string) => void;
  
  // Video element ref
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVideo, setCurrentVideoState] = useState<VideoFile | null>(null);
  const [videoList, setVideoList] = useState<VideoFile[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [activeSubtitle, setActiveSubtitle] = useState<Subtitle | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const setCurrentVideo = useCallback((video: VideoFile) => {
    setCurrentVideoState(video);
    const index = videoList.findIndex(v => v.id === video.id);
    setCurrentVideoIndex(index);
  }, [videoList]);

  const addVideos = useCallback((videos: VideoFile[]) => {
    setVideoList(prev => [...prev, ...videos]);
  }, []);

  const removeVideo = useCallback((id: string) => {
    setVideoList(prev => {
      const video = prev.find(v => v.id === id);
      if (video) {
        URL.revokeObjectURL(video.url);
      }
      return prev.filter(v => v.id !== id);
    });
    
    if (currentVideo?.id === id) {
      setCurrentVideoState(null);
      setCurrentVideoIndex(-1);
    }
  }, [currentVideo]);

  const nextVideo = useCallback(() => {
    if (currentVideoIndex < videoList.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideo(videoList[nextIndex]);
    }
  }, [currentVideoIndex, videoList, setCurrentVideo]);

  const previousVideo = useCallback(() => {
    if (currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideo(videoList[prevIndex]);
    }
  }, [currentVideoIndex, videoList, setCurrentVideo]);

  const clearVideoList = useCallback(() => {
    // Revoke all object URLs to free memory
    videoList.forEach(video => {
      URL.revokeObjectURL(video.url);
    });
    
    // Clear all state
    setVideoList([]);
    setCurrentVideoState(null);
    setCurrentVideoIndex(-1);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    // Clear subtitles as well
    subtitles.forEach(subtitle => {
      URL.revokeObjectURL(subtitle.url);
    });
    setSubtitles([]);
    setActiveSubtitle(null);
  }, [videoList, subtitles]);

  const addSubtitle = useCallback((subtitle: Subtitle) => {
    setSubtitles(prev => [...prev, subtitle]);
  }, []);

  const removeSubtitle = useCallback((id: string) => {
    setSubtitles(prev => {
      const subtitle = prev.find(s => s.id === id);
      if (subtitle) {
        URL.revokeObjectURL(subtitle.url);
      }
      return prev.filter(s => s.id !== id);
    });
    
    if (activeSubtitle?.id === id) {
      setActiveSubtitle(null);
    }
  }, [activeSubtitle]);

  const contextValue: VideoContextType = {
    currentVideo,
    videoList,
    currentVideoIndex,
    setCurrentVideo,
    addVideos,
    removeVideo,
    nextVideo,
    previousVideo,
    clearVideoList,
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
    subtitles,
    activeSubtitle,
    setActiveSubtitle,
    addSubtitle,
    removeSubtitle,
    videoRef,
  };

  return (
    <VideoContext.Provider value={contextValue}>
      {children}
    </VideoContext.Provider>
  );
};