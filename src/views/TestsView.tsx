import React, { useState } from 'react';
import { 
  Search, 
  FlaskConical, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  MessageCircle,
  Calendar,
  Filter
} from 'lucide-react';
import { LaboratoryTest, WebsiteSettings } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface TestsViewProps {
  tests: LaboratoryTest[];
  settings: WebsiteSettings;
  onOpenBooking: (dept?: string, docId?: string, testId?: string) => void;
}

export const TestsView: React.FC<TestsViewProps> = ({
  tests,
  settings,
  onOpenBooking,
}) => {
  const { isUrdu, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const cleanWhatsApp = settings.whatsappNumber.replace(/\D/g, '');
  const phoneIntl = cleanWhatsApp.startsWith('0') ? '92' + cleanWhatsApp.slice(1) : cleanWhatsApp;

  const categories = ['all', 'Routine Tests', 'Special Chemistry', 'Serology'];

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.nameUrdu.includes(searchQuery) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-[#009C9A] bg-[#EAF8F8] px-3 py-1 rounded-md">
          {isUrdu ? 'تشخیصی کیٹلاگ' : 'Laboratory Diagnostic Directory'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#073B73]">
          {t.testsTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isUrdu 
            ? 'اعتماد کلینیکل لیبارٹری میں جدید آٹومیٹڈ اینالائزرز کے ذریعے فوری اور درست ٹیسٹ نتائج۔ 40 فیصد رعایت دستیاب ہے۔'
            : 'Explore routine pathology, biochemistry, and special chemistry investigations with guaranteed quality control and same-day electronic reporting.'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder={t.searchTests}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-[#009C9A] transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#073B73] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? t.allCategories : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <FlaskConical className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-700">No matching laboratory tests found</h4>
            <p className="text-xs text-slate-500">Try modifying your search query or clear the active category filter.</p>
          </div>
        ) : (
          filteredTests.map((test) => {
            const isExpanded = expandedTestId === test.id;
            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#009C9A] p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Category & Turnaround */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#009C9A] uppercase tracking-wider bg-[#EAF8F8] px-2.5 py-0.5 rounded-md">
                      {test.category}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-[#009C9A]" />
                      <span className="tabular-nums">{test.deliveryTimeHours}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                      {isUrdu ? test.nameUrdu : test.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {isUrdu ? test.descriptionUrdu : test.description}
                    </p>
                  </div>

                  {/* Specimen Type */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">Specimen:</span>
                      <strong className="text-slate-800">{test.sampleType}</strong>
                    </div>
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1 animate-in fade-in duration-150">
                        <span className="text-slate-400 font-semibold block">Preparation Guidelines:</span>
                        <p>{isUrdu ? test.preparationInstructionsUrdu : test.preparationInstructions}</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                    className="text-[11px] font-bold text-[#009C9A] hover:underline cursor-pointer"
                  >
                    {isExpanded ? 'Hide preparation guidelines' : 'View preparation guidelines'}
                  </button>
                </div>

                {/* Pricing & Booking Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-lg font-black text-[#073B73] tabular-nums">
                      Rs. {test.discountedPrice}
                    </span>
                    <span className="text-xs text-slate-400 line-through ml-1.5 tabular-nums">
                      Rs. {test.originalPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/${phoneIntl}?text=${encodeURIComponent(`Hello Aitemad Lab, I want to inquire about the ${test.name} test.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#25D366] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Ask on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                    </a>

                    <button
                      onClick={() => onOpenBooking('Laboratory', undefined, test.id)}
                      className="px-3 py-1.5 bg-[#073B73] hover:bg-[#009C9A] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      {t.bookTest}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
