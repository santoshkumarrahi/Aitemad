import React, { useState } from 'react';
import { 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  UserCheck, 
  HeartPulse, 
  CheckCircle2, 
  Calendar, 
  MessageCircle, 
  Clock, 
  Phone,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { Department, WebsiteSettings } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface ServicesViewProps {
  departments: Department[];
  settings: WebsiteSettings;
  onOpenBooking: (dept?: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  departments,
  settings,
  onOpenBooking,
}) => {
  const { isUrdu } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const cleanWhatsApp = settings.whatsappNumber.replace(/\D/g, '');
  const phoneIntl = cleanWhatsApp.startsWith('0') ? '92' + cleanWhatsApp.slice(1) : cleanWhatsApp;

  const filteredDepts = selectedFilter === 'all' 
    ? departments 
    : departments.filter(d => d.slug === selectedFilter);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return Stethoscope;
      case 'FlaskConical': return FlaskConical;
      case 'Pill': return Pill;
      case 'UserCheck': return UserCheck;
      case 'HeartPulse': return HeartPulse;
      default: return Stethoscope;
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-[#009C9A] bg-[#EAF8F8] px-3 py-1 rounded-md">
          {isUrdu ? 'جامع طبی شعبہ جات' : 'Clinical Departments & Services'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#073B73]">
          {isUrdu ? 'بہترین ہیلتھ کیئر سروسز' : 'Best Healthcare Services'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isUrdu 
            ? 'اعتماد ڈائیگنوسٹک سینٹر میں ہر مریض کے لیے مکمل توجہ، جدید آلات اور ماہر ڈاکٹرز کی نگرانی۔'
            : 'Access compassionate medical consultations, advanced laboratory diagnostics, and certified pharmaceuticals under one roof.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl max-w-2xl mx-auto">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-[#073B73] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Services
        </button>
        {departments.map((d) => (
          <button
            key={d.slug}
            onClick={() => setSelectedFilter(d.slug)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedFilter === d.slug
                ? 'bg-[#073B73] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isUrdu ? d.nameUrdu : d.name.split('—')[0]}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="space-y-8">
        {filteredDepts.map((dept) => {
          const Icon = getIcon(dept.icon);
          return (
            <div
              key={dept.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Media image preview */}
              <div className="lg:col-span-4 relative min-h-[220px] bg-slate-100">
                <img
                  src={dept.image || '/src/assets/images/hero_clinic_diagnostic_1790651599920.jpg'}
                  alt={dept.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-md text-[#073B73]">
                  <Icon className="w-6 h-6 text-[#009C9A]" />
                </div>
              </div>

              {/* Details & Features */}
              <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#009C9A] bg-[#EAF8F8] px-3 py-1 rounded-full uppercase tracking-wider">
                      {dept.timing}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Walk-in & Appointments Available
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#073B73]">
                      {isUrdu ? dept.nameUrdu : dept.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {isUrdu ? dept.descriptionUrdu : dept.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {(isUrdu ? dept.featuresUrdu : dept.features).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#009C9A] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onOpenBooking(dept.name)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#073B73] to-[#009C9A] hover:from-[#052d59] hover:to-[#008381] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>

                  <a
                    href={`https://wa.me/${phoneIntl}?text=${encodeURIComponent(`Hello Aitemad Lab, I would like to inquire about ${dept.name} services.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trainee Program Spotlight Banner (from the authentic Urdu/English poster) */}
      <div className="bg-gradient-to-br from-[#073B73] via-[#0A4D96] to-[#009C9A] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[#F6C945] text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Hiring Trainees · ٹرینیز کی ضرورت ہے</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Healthcare Career & Skill Development Opportunity
          </h3>

          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
            Aitemad Diagnostic Center offers hands-on clinical training, professional medical mentorship, and completion certificates for fresh graduates and passionate healthcare students.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="font-bold text-xs text-[#F6C945] block">Operation Theater Trainee</span>
              <span className="text-[11px] text-cyan-200 font-urdu block">آپریشن تھیٹر ٹرینی</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="font-bold text-xs text-[#F6C945] block">Pharmacy Trainee</span>
              <span className="text-[11px] text-cyan-200 font-urdu block">فارمیسی ٹرینی</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="font-bold text-xs text-[#F6C945] block">Laboratory Trainee</span>
              <span className="text-[11px] text-cyan-200 font-urdu block">لیبارٹری ٹرینی</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <a
              href={`https://wa.me/${phoneIntl}?text=${encodeURIComponent('Hello Aitemad Diagnostic Center, I am applying for the Healthcare Trainee Opportunity.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#F6C945] hover:bg-[#eab932] text-[#073B73] font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Apply via WhatsApp ({settings.whatsappNumber})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
