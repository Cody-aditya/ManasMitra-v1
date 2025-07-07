import React, { useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';

interface SubtitleMenuProps {
  onClose: () => void;
}

export const SubtitleMenu: React.FC<SubtitleMenuProps> = ({ onClose }) => {
  const { subtitles, activeSubtitle, setActiveSubtitle, addSubtitle, removeSubtitle } = useVideo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const subtitle = {
      id: crypto.randomUUID(),
      name: file.name,
      url,
      language: 'en', // Default language
    };

    addSubtitle(subtitle);
  };

  const handleSubtitleSelect = (subtitle: any) => {
    setActiveSubtitle(activeSubtitle?.id === subtitle.id ? null : subtitle);
  };

  return (
    <div className="absolute bottom-20 right-4 z-20">
      <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[250px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">Subtitles</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {/* Upload subtitle */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Subtitle</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".srt,.vtt,.ass,.ssa"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* No subtitles option */}
          <button
            onClick={() => setActiveSubtitle(null)}
            className={`w-full text-left px-3 py-2 rounded transition-colors ${
              !activeSubtitle
                ? 'bg-white/20 text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            Off
          </button>

          {/* Available subtitles */}
          {subtitles.map((subtitle) => (
            <div key={subtitle.id} className="flex items-center space-x-2">
              <button
                onClick={() => handleSubtitleSelect(subtitle)}
                className={`flex-1 text-left px-3 py-2 rounded transition-colors ${
                  activeSubtitle?.id === subtitle.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{subtitle.name}</span>
                </div>
              </button>
              <button
                onClick={() => removeSubtitle(subtitle.id)}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-600">
          <p className="text-xs text-gray-400">
            Supported formats: SRT, VTT, ASS, SSA
          </p>
        </div>
      </div>
    </div>
  );
};