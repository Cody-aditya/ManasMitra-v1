import React, { useCallback, useState } from 'react';
import { Upload, FolderOpen, Play, Trash2, FileVideo, Plus, Sparkles } from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';

interface FileManagerProps {
  onVideoSelect: () => void;
}

export const FileManager: React.FC<FileManagerProps> = ({ onVideoSelect }) => {
  const { videoList, addVideos, removeVideo, setCurrentVideo, currentVideo, clearVideoList } = useVideo();
  const [dragActive, setDragActive] = useState(false);

  const supportedFormats = [
    'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mpeg', 'mpg',
    'ogv', '3gp', '3g2', 'mxf', 'ts', 'm2ts', 'f4v', 'f4p', 'f4a'
  ];

  const handleFiles = useCallback((files: FileList) => {
    const videoFiles = Array.from(files).filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return extension && supportedFormats.includes(extension);
    });

    const processedFiles = videoFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }));

    addVideos(processedFiles);
  }, [addVideos]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleDirectoryInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const playVideo = useCallback((video: any) => {
    setCurrentVideo(video);
    onVideoSelect();
  }, [setCurrentVideo, onVideoSelect]);

  const handleClearAll = useCallback(() => {
    if (confirm('Are you sure you want to clear all videos? This action cannot be undone.')) {
      clearVideoList();
    }
  }, [clearVideoList]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 overflow-hidden ${
            dragActive
              ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02]'
              : 'border-gray-300 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-slate-800/50'
          }`}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-2xl transition-all duration-300 ${
                dragActive 
                  ? 'bg-indigo-100 dark:bg-indigo-800/50 scale-110' 
                  : 'bg-gray-100 dark:bg-slate-700'
              }`}>
                <Upload className={`w-12 h-12 transition-colors duration-300 ${
                  dragActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'
                }`} />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Upload Video Files
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Drag and drop your video files here, or click to browse. Supports all major video formats.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <label className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-semibold">Add Files</span>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
              
              <label className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105">
                <FolderOpen className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-semibold">Add Folder</span>
                <input
                  type="file"
                  multiple
                  webkitdirectory=""
                  onChange={handleDirectoryInput}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
                <Sparkles className="w-4 h-4 inline mr-2 text-indigo-500" />
                Supported formats:
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                MP4, MKV, AVI, MOV, WMV, FLV, WebM, MPEG, OGV, 3GP, 3G2, MXF, TS, M2TS, F4V, F4P, F4A
              </p>
            </div>
          </div>
        </div>

        {/* Video List */}
        {videoList.length > 0 && (
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-5 border-b border-gray-200/50 dark:border-slate-700/50 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                    <FileVideo className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Video Library
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {videoList.length} video{videoList.length !== 1 ? 's' : ''} loaded
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200/50 dark:divide-slate-700/50">
              {videoList.map((video) => (
                <div
                  key={video.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200 ${
                    currentVideo?.id === video.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className={`p-3 rounded-xl ${
                        currentVideo?.id === video.id 
                          ? 'bg-indigo-100 dark:bg-indigo-800/50' 
                          : 'bg-gray-100 dark:bg-slate-700'
                      }`}>
                        <FileVideo className={`w-6 h-6 ${
                          currentVideo?.id === video.id 
                            ? 'text-indigo-600 dark:text-indigo-400' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {video.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {video.size && formatFileSize(video.size)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-4">
                      <button
                        onClick={() => playVideo(video)}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                      >
                        <Play className="w-4 h-4" />
                        <span>Play</span>
                      </button>
                      <button
                        onClick={() => removeVideo(video.id)}
                        className="p-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {videoList.length === 0 && (
          <div className="text-center py-16">
            <div className="p-6 bg-gray-100 dark:bg-slate-700 rounded-2xl inline-block mb-6">
              <FileVideo className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              No videos loaded
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Upload some video files to get started with your personal video library
            </p>
          </div>
        )}
      </div>
    </div>
  );
};