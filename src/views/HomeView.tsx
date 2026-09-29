import React from 'react';
import { 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  ShieldCheck, 
  Clock, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  UserCheck, 
  HeartPulse, 
  Play, 
  Sparkles, 
  MapPin, 
  ChevronRight,
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';
import { 
  WebsiteSettings, 
  Department, 
  Doctor, 
  LaboratoryTest, 
  TestPackage, 
  GalleryMediaItem 
} from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface HomeViewProps {
  settings: WebsiteSettings;
  departments: Department[];
  doctors: Doctor[];
  tests: LaboratoryTest[];
  packages: TestPackage[];
  gallery: GalleryMediaItem[];
  onOpenBooking: (dept?: string, doctorId?: string, testId?: string) => void;
  onNavigateTab: (tab: string) => void;
  onSelectMedia: (item: GalleryMediaItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  departments,
  doctors,
  tests,
  packages,
  gallery,
  onOpenBooking,
  onNavigateTab,
  onSelectMedia,
}) => {
  const { isUrdu, t } = useLanguage();

  const cleanWhatsApp = settings.whatsappNumber.replace(/\D/g, '');
  const phoneIntl = cleanWhatsApp.startsWith('0') ? '92' + cleanWhatsApp.slice(1) : cleanWhatsApp;

  const getDepartmentIcon = (iconName: string) => {
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
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#073B73] via-[#0A4D96] to-[#009C9A] text-white">
        {/* Abstract diagnostic grid background lines */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#F6C945] animate-ping" />
                <span>{isUrdu ? 'آپ کی صحت ہماری اولین ترجیح' : 'Your Health, Our Priority · 24/7 Clinical Care'}</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                  {isUrdu ? 'اعتماد ڈائیگنوسٹک سینٹر' : 'AITEMAD'}
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F6C945] uppercase tracking-wide">
                  {isUrdu ? 'اینڈ کلینیکل لیب · راولپنڈی' : 'DIAGNOSTIC CENTER & CLINICAL LAB'}
                </h2>
                <div className="inline-block py-1 px-3 bg-white/15 backdrop-blur-sm rounded-lg border border-white/25 mt-1">
                  <span className="text-xs sm:text-sm font-black tracking-widest text-cyan-100 uppercase">
                    {isUrdu ? settings.sloganUrdu : settings.slogan}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-cyan-50/90 leading-relaxed max-w-2xl font-normal">
                {isUrdu ? settings.descriptionUrdu : settings.description}
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenBooking()}
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-[#F6C945] hover:bg-[#eab932] text-[#073B73] font-black text-sm sm:text-base rounded-xl shadow-xl shadow-black/20 hover:scale-102 transition-all cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{t.bookAppointment}</span>
                </button>

                <button
                  onClick={() => onNavigateTab('services')}
                  className="flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm sm:text-base rounded-xl border border-white/30 transition-all cursor-pointer"
                >
                  <span>{t.exploreServices}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/${phoneIntl}?text=${encodeURIComponent('Hello Aitemad Diagnostic Center, I would like to book an appointment.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>{t.chatWhatsApp}</span>
                </a>
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-cyan-100 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F6C945] shrink-0" />
                  <span>{t.featDoctors}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F6C945] shrink-0" />
                  <span>{t.featReports}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F6C945] shrink-0" />
                  <span>{t.featEquipment}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F6C945] shrink-0" />
                  <span>{t.featFriendly}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <Clock className="w-4 h-4 text-[#F6C945] shrink-0" />
                  <span>{t.featSupport}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual & 24/7 Clock Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl group">
                <img
                  src="/src/assets/images/hero_clinic_diagnostic_1790651599920.jpg"
                  alt="Aitemad Diagnostic Center Rawalpindi"
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#073B73]/90 via-transparent to-transparent" />

                {/* Floating 24/7 Service Dial Badge (as on the poster) */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[#073B73] p-3 rounded-2xl shadow-xl border border-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#EAF8F8] text-[#009C9A] flex items-center justify-center font-black text-sm">
                    <Clock className="w-6 h-6 animate-pulse text-[#009C9A]" />
                  </div>
                  <div>
                    <span className="font-black text-base sm:text-lg text-[#073B73] block leading-none">
                      {t.badge247}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                      {t.badge247Sub}
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-xl text-xs text-white flex items-center justify-between">
                  <span className="font-semibold truncate">
                    Bangash Street, Car Chowk, Rawalpindi
                  </span>
                  <button
                    onClick={() => onNavigateTab('about')}
                    className="text-[#F6C945] hover:underline font-bold text-xs shrink-0 flex items-center gap-1"
                  >
                    <span>Tour</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BEST HEALTHCARE SERVICES (SECTION 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#009C9A]">
            {isUrdu ? 'جامع طبی و تشخیصی سہولیات' : 'Medical Excellence & Diagnostics'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#073B73]">
            {t.servicesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* 5 Core Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => {
            const Icon = getDepartmentIcon(dept.icon);
            return (
              <div
                key={dept.id}
                className={`bg-white rounded-2xl border border-slate-200/90 hover:border-[#009C9A] p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                  index === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#EAF8F8] group-hover:bg-[#009C9A] text-[#009C9A] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {dept.timing}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#073B73] group-hover:text-[#009C9A] transition-colors">
                      {isUrdu ? dept.nameUrdu : dept.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {isUrdu ? dept.descriptionUrdu : dept.description}
                    </p>
                  </div>

                  {/* Service Features Checklist */}
                  <ul className="space-y-1.5 pt-2 text-xs text-slate-700">
                    {(isUrdu ? dept.featuresUrdu : dept.features).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#009C9A] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Actions */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onNavigateTab('services')}
                    className="text-xs font-bold text-slate-600 hover:text-[#073B73] transition-colors cursor-pointer"
                  >
                    {t.viewDetails} →
                  </button>

                  <button
                    onClick={() => onOpenBooking(dept.name)}
                    className="px-4 py-2 bg-[#073B73] hover:bg-[#009C9A] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    {t.bookAppointment}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 40% OFF GRAND OPENING PROMOTIONS & TEST PACKAGES (SECTION 9) */}
      <section className="bg-gradient-to-br from-[#EAF8F8] to-slate-100 py-16 px-4 sm:px-6 border-y border-[#009C9A]/20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#009C9A] bg-white px-3 py-1 rounded-md shadow-2xs">
                {t.offMarketRates}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#073B73]">
                {t.offersTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.offersSubtitle}
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('offers')}
              className="px-4 py-2.5 bg-[#073B73] hover:bg-[#052d59] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              {t.viewAllOffers} →
            </button>
          </div>

          {/* Promotional Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
              >
                {/* 40% OFF Badge ribbon */}
                <div className="absolute top-0 right-0 bg-[#F6C945] text-[#073B73] font-black text-[11px] px-3 py-1 rounded-bl-xl shadow-xs">
                  {pkg.discountBadge}
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#073B73] transition-colors leading-snug">
                    {isUrdu ? pkg.titleUrdu : pkg.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isUrdu ? pkg.descriptionUrdu : pkg.description}
                  </p>

                  {/* Included Tests list */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Includes {pkg.testCount} Tests:
                    </span>
                    <ul className="space-y-1">
                      {pkg.testNames.slice(0, 4).map((name, i) => (
                        <li key={i} className="truncate">· {name}</li>
                      ))}
                      {pkg.testNames.length > 4 && (
                        <li className="text-[11px] text-[#009C9A] font-semibold">
                          +{pkg.testNames.length - 4} more tests included
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Pricing row */}
                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black text-[#073B73] tabular-nums">
                      Rs. {pkg.discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 line-through tabular-nums">
                      Rs. {pkg.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onOpenBooking('Laboratory')}
                    className="w-full py-2.5 bg-gradient-to-r from-[#073B73] to-[#009C9A] hover:from-[#052d59] hover:to-[#008381] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    {t.bookNow}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LABORATORY TESTS CATALOG PREVIEW (SECTION 8) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#009C9A]">
              Certified Pathology & Chemistry
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#073B73]">
              {t.testsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.testsSubtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('tests')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            View Full Test Catalog →
          </button>
        </div>

        {/* Quick Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.slice(0, 6).map((test) => (
            <div
              key={test.id}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-[#009C9A] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-[#009C9A] uppercase tracking-wider">{test.category}</span>
                  <span className="tabular-nums">⚡ {test.deliveryTimeHours}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {isUrdu ? test.nameUrdu : test.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {isUrdu ? test.descriptionUrdu : test.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm sm:text-base font-extrabold text-[#073B73] tabular-nums">
                    Rs.{test.discountedPrice}
                  </span>
                  <span className="text-[11px] text-slate-400 line-through ml-1.5 tabular-nums">
                    Rs.{test.originalPrice}
                  </span>
                </div>

                <button
                  onClick={() => onOpenBooking('Laboratory', undefined, test.id)}
                  className="px-3 py-1.5 bg-[#EAF8F8] hover:bg-[#009C9A] text-[#073B73] hover:text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {t.bookTest}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. "TAKE A LOOK INSIDE OUR CLINIC" GALLERY (SECTION 6) */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F6C945]">
                Authentic Clinic Facilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {t.galleryTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {t.gallerySubtitle}
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('gallery')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
            >
              {t.viewAllMedia} →
            </button>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gallery.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectMedia(item)}
                className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-800 border border-white/10 cursor-pointer shadow-lg"
              >
                <img
                  src={item.type === 'video' ? (item.thumbnailUrl || item.url) : item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#009C9A]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] font-bold text-[#F6C945] uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {isUrdu ? item.titleUrdu : item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ABOUT US & MISSION/VISION (SECTION 7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-[#009C9A]">
              About Aitemad Diagnostic Center
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#073B73]">
              {isUrdu ? 'اعتماد اور درستگی ہماری بنیاد ہے' : 'Care, Accuracy & Uncompromising Trust'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Aitemad Diagnostic Center & Clinical Lab was established to provide the community of Rawalpindi and surrounding districts with reliable, accessible, and compassionate healthcare. Equipped with high-tech automated hematology analyzers, digital diagnostic tools, and qualified medical professionals, we ensure that every diagnosis is backed by clinical rigor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-black text-[#073B73] block uppercase">Our Mission</span>
                <p className="text-[11px] text-slate-600">To deliver accurate diagnosis and compassionate care to every patient regardless of background.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-black text-[#009C9A] block uppercase">Our Vision</span>
                <p className="text-[11px] text-slate-600">To be Rawalpindi's most trusted healthcare partner through digital diagnostic innovation.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-black text-[#F6C945] block uppercase">Our Philosophy</span>
                <p className="text-[11px] text-slate-600">Care, Accuracy, Trust: Three pillars that guide every sample, prescription, and consultation.</p>
              </div>
            </div>

            <div>
              <button
                onClick={() => onNavigateTab('about')}
                className="px-5 py-2.5 bg-[#073B73] hover:bg-[#052d59] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Learn More About Us →
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100">
              <img
                src="/src/assets/images/doctor_consultation_opd_1790651637185.jpg"
                alt="Doctor consultation at Aitemad Diagnostic Center"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. DOCTOR DIRECTORY SPOTLIGHT (SECTION 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#009C9A]">
            Qualified Consultants
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#073B73]">
            {t.doctorsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            {t.doctorsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#073B73] to-[#009C9A] text-white flex items-center justify-center font-bold text-xl shadow-md">
                  {doc.name.replace('Dr. ', '').charAt(0)}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#009C9A] uppercase tracking-wider block">
                    {isUrdu ? doc.departmentUrdu : doc.department}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#073B73] transition-colors">
                    {isUrdu ? doc.nameUrdu : doc.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {doc.qualifications}
                  </p>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#009C9A]" />
                    <span>{isUrdu ? doc.consultationDaysUrdu : doc.consultationDays.join(', ')}</span>
                  </p>
                  <p className="tabular-nums text-slate-500 pl-5">
                    {doc.consultationHours}
                  </p>
                  <p className="font-bold text-[#073B73] pt-1">
                    Fee: Rs. {doc.fee}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onOpenBooking(doc.department, doc.id)}
                  className="w-full py-2 bg-[#073B73] hover:bg-[#009C9A] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. VERIFIED LOCATION & CONTACT SECTION (SECTION 17) */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-[#009C9A]">
              Visit Our Clinic
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#073B73]">
              Convenient Location in Rawalpindi
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#009C9A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Clinic Address:</strong>
                  <span>{isUrdu ? settings.addressUrdu : settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#009C9A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Direct Contact Numbers:</strong>
                  <span className="tabular-nums block">{settings.phonePrimary} · {settings.phoneSecondary}</span>
                  <span className="text-slate-500">WhatsApp: {settings.whatsappNumber}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#009C9A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Opening Hours:</strong>
                  <span>{settings.hoursWeekdays}</span>
                  <span className="block">{settings.hoursSunday}</span>
                  <span className="text-[#009C9A] font-bold block mt-1">24/7 Emergency & Laboratory Services</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#073B73] hover:bg-[#052d59] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Get Directions on Google Maps</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Map Embed Frame */}
          <div className="lg:col-span-7 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <iframe
              title="Aitemad Diagnostic Center Location Map"
              src={settings.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
