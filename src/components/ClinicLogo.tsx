import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface ClinicLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'simple';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  className = '',
  variant = 'light',
  showTagline = true,
  size = 'md',
}) => {
  const { isUrdu } = useLanguage();

  const isLight = variant === 'light'; // Light background (dark text)
  const isDark = variant === 'dark';   // Dark background (white text)

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-sm font-extrabold tracking-tight leading-none',
    md: 'text-base sm:text-lg font-extrabold tracking-tight leading-none',
    lg: 'text-xl sm:text-2xl font-black tracking-tight leading-none',
  };

  const subSizes = {
    sm: 'text-[9px] font-semibold tracking-wider mt-0.5',
    md: 'text-[10px] sm:text-[11px] font-semibold tracking-wider mt-1',
    lg: 'text-xs font-bold tracking-widest mt-1.5',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Clinic Seal / Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#073B73] via-[#0A4D96] to-[#009C9A] p-0.5 shadow-md shadow-[#073B73]/15`}>
        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center p-1 relative overflow-hidden">
          {/* Subtle medical cross and caduceus wave watermark */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#009C9A]/10 to-[#073B73]/10" />
          
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full z-10">
            {/* Styled Medical 'A' / Pulse Icon */}
            <path
              d="M8 32L17.5 7C18.2 5.5 20.3 5.5 21 7L31 32"
              stroke="#073B73"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Teal crossbar with heartbeat rhythm */}
            <path
              d="M13 22H18L20 17L22 25L24 22H27"
              stroke="#009C9A"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Diagnostic Spark Dot */}
            <circle cx="20" cy="9" r="2.2" fill="#F6C945" />
          </svg>
        </div>
      </div>

      {/* Brand Text Lockup */}
      <div className="flex flex-col text-left">
        {isUrdu ? (
          <>
            <span className={`${titleSizes[size]} ${isDark ? 'text-white' : 'text-[#073B73]'} urdu-text`}>
              اعتماد ڈائیگنوسٹک سینٹر
            </span>
            <span className={`${subSizes[size]} text-[#009C9A] font-medium urdu-text leading-tight`}>
              اینڈ کلینیکل لیب · راولپنڈی
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className={`${titleSizes[size]} ${isDark ? 'text-white' : 'text-[#073B73]'}`}>
                AITEMAD
              </span>
            </div>
            <span className={`${subSizes[size]} text-[#009C9A] uppercase`}>
              Diagnostic Center & Clinical Lab
            </span>
            {showTagline && size !== 'sm' && (
              <span className={`text-[9px] ${isDark ? 'text-slate-300' : 'text-slate-500'} italic mt-0.5`}>
                Trusted Results, Accurate Diagnosis
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
