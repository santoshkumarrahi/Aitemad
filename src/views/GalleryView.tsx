import React, { useState } from 'react';
import { Play, Image as ImageIcon, Video, Filter, Eye } from 'lucide-react';
import { GalleryMediaItem } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface GalleryViewProps {
  gallery: GalleryMediaItem[];
  onSelectMedia: (item: GalleryMediaItem) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ gallery, onSelectMedia }) => {
  const { isUrdu, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');

  const categories = ['all', 'Exterior', 'Reception', 'Laboratory', 'OPD', 'Pharmacy', 'Opening', 'Equipment'];

  const filteredMedia = gallery.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesType = mediaTypeFilter === 'all' || item.type === mediaTypeFilter;
    return matchesCat && matchesType;
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-[#009C9A] bg-[#EAF8F8] px-3 py-1 rounded-md">
          {isUrdu ? 'تصاویر و ویڈیوز' : 'Clinic Visual Tour'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#073B73]">
          {t.galleryTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isUrdu 
            ? 'اعتماد ڈائیگنوسٹک سینٹر کی جدید لیبارٹری، کنسلٹیشن رومز اور افتتاحی تقریب کی تصویری و ویڈیو جھلکیاں۔'
            : 'Explore our diagnostic facility at Bangash Street, Car Chowk Rawalpindi, featuring state-of-the-art hematology analyzers and patient consultation suites.'}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Media type toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setMediaTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mediaTypeFilter === 'all' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Media
          </button>
          <button
            onClick={() => setMediaTypeFilter('image')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mediaTypeFilter === 'image' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photos</span>
          </button>
          <button
            onClick={() => setMediaTypeFilter('video')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mediaTypeFilter === 'video' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#009C9A] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Areas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectMedia(item)}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#009C9A] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Visual Frame */}
            <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
              <img
                src={item.type === 'video' ? (item.thumbnailUrl || item.url) : item.url}
                alt={item.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

              {/* Type Badge */}
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                {item.type === 'video' ? <Video className="w-3 h-3 text-[#F6C945]" /> : <ImageIcon className="w-3 h-3 text-cyan-300" />}
                <span>{item.category}</span>
              </div>

              {/* Video Play Button Overlay */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#009C9A]/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="p-4 space-y-1.5">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#073B73] transition-colors leading-snug">
                {isUrdu ? item.titleUrdu : item.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {isUrdu ? item.captionUrdu : item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
