import React from 'react';
import { Sparkles, CheckCircle2, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { TestPackage, WebsiteSettings } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface OffersViewProps {
  packages: TestPackage[];
  settings: WebsiteSettings;
  onOpenBooking: (dept?: string) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({ packages, settings, onOpenBooking }) => {
  const { isUrdu, t } = useLanguage();

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero Banner inspired by the poster */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#073B73] via-[#0A4D96] to-[#009C9A] p-8 sm:p-14 text-white shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6C945] text-[#073B73] font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>40% OFF Market Rates · Limited Time Offer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {isUrdu ? 'افتتاحی رعایت 40 فیصد' : 'Grand Opening Special Diagnostic Packages'}
          </h1>

          <p className="text-sm sm:text-base text-cyan-100 leading-relaxed">
            {isUrdu 
              ? 'روٹین لیب ٹیسٹس، شوگر، کولیسٹرول اور سپیشل کیمسٹری پر مارکیٹ سے 40 فیصد تک کی رعایت۔'
              : 'Avail exclusive subsidised health packages designed for early detection of vital organ conditions. Accurate reports backed by automated analyzers.'}
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl border-2 border-slate-200 hover:border-[#009C9A] p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-[#F6C945] text-[#073B73] font-black text-xs px-3.5 py-1.5 rounded-full shadow-xs">
              {pkg.discountBadge}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#073B73]">
                  {isUrdu ? pkg.titleUrdu : pkg.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {isUrdu ? pkg.descriptionUrdu : pkg.description}
                </p>
              </div>

              {/* Tests Included */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Included Investigations ({pkg.testCount}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {pkg.testNames.map((testName, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#009C9A] shrink-0" />
                      <span className="truncate">{testName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Details */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#073B73] tabular-nums">
                  Rs. {pkg.discountedPrice.toLocaleString()}
                </span>
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  Rs. {pkg.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Save Rs. {(pkg.originalPrice - pkg.discountedPrice).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Valid until {pkg.validUntil}
              </span>
              <button
                onClick={() => onOpenBooking('Laboratory')}
                className="px-6 py-2.5 bg-[#073B73] hover:bg-[#009C9A] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Book Package Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
