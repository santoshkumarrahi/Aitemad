import React from 'react';
import { X, Play, Tag, Calendar } from 'lucide-react';
import { GalleryMediaItem } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface MediaModalProps {
  item: GalleryMediaItem | null;
  onClose: () => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ item, onClose }) => {
  const { isUrdu } = useLanguage();
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Frame */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {item.type === 'video' ? (
            <video
              src={item.url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Caption & Metadata */}
        <div className="p-5 text-white space-y-2 bg-gradient-to-t from-slate-950 to-slate-900">
          <div className="flex items-center gap-3 text-xs text-cyan-300">
            <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-[#009C9A]" />
              {item.category}
            </span>
            {item.date && (
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-base sm:text-xl text-white">
            {isUrdu ? item.titleUrdu : item.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isUrdu ? item.captionUrdu : item.caption}
          </p>
        </div>
      </div>
    </div>
  );
};
