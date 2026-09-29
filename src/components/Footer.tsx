import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUp, 
  ShieldCheck, 
  MessageCircle,
  ExternalLink 
} from 'lucide-react';
import { ClinicLogo } from './ClinicLogo.tsx';
import { WebsiteSettings } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigateTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigateTab,
  onOpenBooking,
}) => {
  const { isUrdu, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsApp = settings.whatsappNumber.replace(/\D/g, '');
  const phoneIntl = cleanWhatsApp.startsWith('0') ? '92' + cleanWhatsApp.slice(1) : cleanWhatsApp;

  return (
    <footer className="bg-[#05264A] text-slate-300 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <ClinicLogo variant="dark" size="lg" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {isUrdu 
                ? 'اعتماد ڈائیگنوسٹک سینٹر اینڈ کلینیکل لیب — راولپنڈی میں 24 گھنٹے معیاری تشخیصی اور طبی سہولیات فراہم کرنے والا قابل اعتماد ہیلتھ کیئر مرکز۔'
                : 'Premier diagnostic laboratory, outpatient consultation clinic, and pharmacy in Rawalpindi. Committed to medical excellence and patient well-being.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${phoneIntl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#F6C945]" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navServices}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('tests')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navTests}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('doctors')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navDoctors}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('gallery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navGallery}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('offers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navOffers}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Departments */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Departments
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="text-[#009C9A]">·</span>
                <span>OPD — Outpatient Clinic</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#009C9A]">·</span>
                <span>Clinical Diagnostic Laboratory</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#009C9A]">·</span>
                <span>Pharmacy & Healthcare Essentials</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#009C9A]">·</span>
                <span>Consultant Medical Specialist</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#009C9A]">·</span>
                <span>Consultant Gynecologist</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#009C9A]">·</span>
                <span>Home Sample Collection (Doorstep)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              {t.contactInfo}
            </h4>
            <div className="space-y-2.5">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F6C945] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {isUrdu ? settings.addressUrdu : settings.address}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F6C945] shrink-0" />
                <span className="tabular-nums font-semibold text-white">
                  {settings.phonePrimary} · {settings.phoneSecondary}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F6C945] shrink-0" />
                <span>{settings.email}</span>
              </p>

              <p className="flex items-start gap-2 pt-1 border-t border-white/10">
                <Clock className="w-4 h-4 text-[#009C9A] shrink-0 mt-0.5" />
                <span>
                  {settings.hoursWeekdays}
                  <br />
                  {settings.hoursSunday}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {settings.clinicName}. {t.allRightsReserved}
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigateTab('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigateTab('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
