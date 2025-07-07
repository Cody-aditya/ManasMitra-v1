import React from 'react';
import { Moon, Sun, Video, FolderOpen, Play } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useVideo } from '../contexts/VideoContext';

interface HeaderProps {
  currentView: 'player' | 'files';
  onViewChange: (view: 'player' | 'files') => void;
  isPlayerReady: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, isPlayerReady }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentVideo } = useVideo();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
                ManasMitra
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-none">
                by Aditya Kumar Gupta
              </p>
            </div>
          </div>
          
          {currentVideo && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium truncate max-w-xs">
                {currentVideo.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <nav className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => onViewChange('files')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === 'files'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span className="font-medium">Files</span>
            </button>
            
            <button
              onClick={() => onViewChange('player')}
              disabled={!isPlayerReady}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === 'player'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : isPlayerReady
                    ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4" />
              <span className="font-medium">Player</span>
            </button>
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};