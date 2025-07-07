import React from 'react';
import { Github, ExternalLink, Heart, Code, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-8">
          {/* Main content */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Crafted with passion
              </h3>
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              ManasMitra is a modern, feature-rich video player built with cutting-edge web technologies. 
              Experience seamless video playback with an intuitive interface designed for the modern web.
            </p>
          </div>

          {/* Developer info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-bold text-white mb-2">
                  Developed by Aditya Kumar Gupta
                </h4>
                <p className="text-gray-400 mb-6">
                  Full Stack Developer & UI/UX Enthusiast
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://github.com/Cody-aditya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50"
                >
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
                    GitHub Profile
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                </a>

                <a
                  href="https://cody-aditya.github.io/My-Portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 rounded-xl transition-all duration-200 border border-indigo-500/30 hover:border-indigo-400/50"
                >
                  <Sparkles className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  <span className="font-medium text-indigo-300 group-hover:text-indigo-200 transition-colors">
                    Portfolio
                  </span>
                  <ExternalLink className="w-4 h-4 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-400">
                  Built with React, TypeScript & Tailwind CSS
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                © 2024 ManasMitra. Made with modern web technologies.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};