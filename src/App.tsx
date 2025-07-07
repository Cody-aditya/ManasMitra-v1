import React, { useState, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { FileManager } from './components/FileManager';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import { VideoProvider } from './contexts/VideoContext';

function App() {
  const [currentView, setCurrentView] = useState<'player' | 'files'>('files');
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  return (
    <ThemeProvider>
      <VideoProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 transition-all duration-300 flex flex-col">
          <Header 
            currentView={currentView} 
            onViewChange={setCurrentView}
            isPlayerReady={isPlayerReady}
          />
          
          <main className="flex-1 pt-16">
            {currentView === 'files' ? (
              <FileManager 
                onVideoSelect={() => {
                  setCurrentView('player');
                  setIsPlayerReady(true);
                }}
              />
            ) : (
              <VideoPlayer />
            )}
          </main>

          {currentView === 'files' && <Footer />}
        </div>
      </VideoProvider>
    </ThemeProvider>
  );
}

export default App;