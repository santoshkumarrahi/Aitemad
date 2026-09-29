import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Menu, 
  X, 
  Calendar, 
  Search, 
  User, 
  ShieldCheck, 
  MessageSquare,
  Globe
} from 'lucide-react';
import { ClinicLogo } from './ClinicLogo.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { WebsiteSettings } from '../types/index.ts';

interface NavbarProps {
  settings: WebsiteSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenTracking: () => void;
  onOpenPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenTracking,
  onOpenPortal,
}) => {
  const { language, setLanguage, isUrdu, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'about', label: t.navAbout },
    { id: 'services', label: t.navServices },
    { id: 'tests', label: t.navTests },
    { id: 'doctors', label: t.navDoctors },
    { id: 'gallery', label: t.navGallery },
    { id: 'offers', label: t.navOffers },
    { id: 'contact', label: t.navContact },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Urgent Emergency & Contact Ribbon */}
      <div className="bg-[#073B73] text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 text-[11px] sm:text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-cyan-100">
              <MapPin className="w-3.5 h-3.5 text-[#F6C945] shrink-0" />
              <span className="truncate max-w-[280px] sm:max-w-md">
                {isUrdu ? settings.addressUrdu : settings.address}
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-cyan-100">
              <Clock className="w-3.5 h-3.5 text-[#009C9A] shrink-0" />
              <span>{settings.emergencyService}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`tel:${settings.phonePrimary}`}
              className="flex items-center gap-1.5 hover:text-[#F6C945] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#F6C945]" />
              <span className="tabular-nums font-medium">{settings.phonePrimary}</span>
            </a>
            <span className="text-white/30 hidden sm:inline">|</span>
            <a
              href={`tel:${settings.phoneSecondary}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-[#F6C945] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#F6C945]" />
              <span className="tabular-nums font-medium">{settings.phoneSecondary}</span>
            </a>
            <span className="text-white/30">|</span>
            {/* Language Switcher Button */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              title="Switch language between English and Urdu"
            >
              <Globe className="w-3 h-3 text-[#F6C945]" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Clinic Brand Wordmark & Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left cursor-pointer group focus:outline-hidden"
        >
          <ClinicLogo size="md" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold text-slate-700">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === link.id
                  ? 'text-[#073B73] font-bold'
                  : 'text-slate-600 hover:text-[#073B73]'
              }`}
            >
              {link.label}
              {activeTab === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009C9A] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Track Appointment */}
          <button
            onClick={onOpenTracking}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#073B73] bg-slate-100/80 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#009C9A]" />
            <span>{t.navTrack}</span>
          </button>

          {/* Patient Portal */}
          <button
            onClick={onOpenPortal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#073B73] bg-slate-100/80 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#073B73]" />
            <span>{t.navPortal}</span>
          </button>

          {/* Book Appointment CTA */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#073B73] to-[#009C9A] hover:from-[#052d59] hover:to-[#008381] rounded-xl shadow-md shadow-[#073B73]/20 hover:shadow-lg transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#F6C945]" />
            <span>{t.bookAppointment}</span>
          </button>

          {/* Admin shortcut link */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`p-2 text-slate-400 hover:text-[#073B73] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'admin' ? 'text-[#073B73] bg-slate-100' : ''
            }`}
            title="Clinic Admin Dashboard"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-700 hover:text-[#073B73] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-2 px-3 text-left rounded-lg transition-colors ${
                  activeTab === link.id
                    ? 'bg-[#EAF8F8] text-[#073B73] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              <Search className="w-3.5 h-3.5 text-[#009C9A]" />
              <span>{t.navTrack}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              <User className="w-3.5 h-3.5 text-[#073B73]" />
              <span>{t.navPortal}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick('admin');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-600 bg-slate-50 rounded-lg"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#073B73]" />
              <span>{t.navAdmin} Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
