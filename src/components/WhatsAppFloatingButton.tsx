import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Stethoscope, FlaskConical, Pill, UserCheck, HeartPulse, Home } from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface WhatsAppFloatingButtonProps {
  settings: WebsiteSettings;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isUrdu } = useLanguage();

  const cleanNumber = settings.whatsappNumber.replace(/\D/g, '');
  // Format international number (e.g. 03403766768 -> 923403766768)
  const phoneIntl = cleanNumber.startsWith('0') ? '92' + cleanNumber.slice(1) : cleanNumber;

  const quickMessages = [
    {
      id: 'general',
      title: isUrdu ? 'عام معلومات و رہنمائی' : 'General Healthcare Inquiry',
      desc: isUrdu ? 'اوقات کار اور عمومی سوالات' : 'Timings, facilities and guidance',
      icon: MessageCircle,
      text: 'Hello Aitemad Diagnostic Center, I would like to inquire about your healthcare services and timings in Rawalpindi.',
    },
    {
      id: 'opd',
      title: isUrdu ? 'او پی ڈی اپائنٹمنٹ' : 'OPD Doctor Consultation',
      desc: isUrdu ? 'جنرل فزیشن چیک اپ' : 'General physician appointment',
      icon: Stethoscope,
      text: 'Hello, I want to book an OPD doctor consultation at Aitemad Diagnostic Center.',
    },
    {
      id: 'lab',
      title: isUrdu ? 'لیب ٹیسٹ اور 40% ڈسکاؤنٹ' : 'Laboratory Test & 40% Discount',
      desc: isUrdu ? 'خون کے ٹیسٹ و کیمسٹری' : 'Routine tests & chemistry panel',
      icon: FlaskConical,
      text: 'Hello, I want to ask about your laboratory tests and the 40% discount offer at Aitemad Lab.',
    },
    {
      id: 'specialist',
      title: isUrdu ? 'میڈیکل سپیشلسٹ مشاورت' : 'Medical Specialist Consultation',
      desc: isUrdu ? 'شوگر، بلڈ پریشر، جگر' : 'Internal medicine & chronic care',
      icon: UserCheck,
      text: 'Hello, I would like to schedule an appointment with your Medical Specialist (Dr. Muhammad Tahir).',
    },
    {
      id: 'gynae',
      title: isUrdu ? 'گائناکالوجسٹ اپائنٹمنٹ' : 'Gynecologist Appointment',
      desc: isUrdu ? 'خواتین کا معائنہ و زچگی' : 'Maternal & women health consultation',
      icon: HeartPulse,
      text: 'Hello, I would like to book a confidential consultation with Dr. Ayesha Noor (Consultant Gynecologist).',
    },
    {
      id: 'home',
      title: isUrdu ? 'گھر سے نمونہ حاصل کرنا' : 'Home Sample Collection',
      desc: isUrdu ? 'گھر کی دہلیز پر ٹیسٹنگ' : 'Doorstep blood & urine collection',
      icon: Home,
      text: 'Hello Aitemad Lab, I need home sample collection service in Rawalpindi for diagnostic laboratory tests.',
    },
    {
      id: 'pharmacy',
      title: isUrdu ? 'فارمیسی و ادویات معلوم کرنا' : 'Pharmacy & Medicine Availability',
      desc: isUrdu ? 'نسخہ جات اور دستیابی' : 'Prescription availability inquiry',
      icon: Pill,
      text: 'Hello, I would like to check medicine availability at Aitemad Pharmacy.',
    }
  ];

  const handleOpenWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${phoneIntl}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* WhatsApp Dialog Menu */}
      {isOpen && (
        <div className="mb-3 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#009C9A] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">
                  {isUrdu ? 'اعتماد ڈائیگنوسٹک واٹس ایپ ہیلپ لائن' : 'Aitemad Diagnostic WhatsApp'}
                </h4>
                <p className="text-[11px] text-cyan-100 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {isUrdu ? 'لائیو آن لائن عملہ' : 'Online · Quick Response in 5 mins'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick options list */}
          <div className="p-3 max-h-[360px] overflow-y-auto divide-y divide-slate-100 space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase px-2 py-1 tracking-wider">
              {isUrdu ? 'مطلوبہ سروس منتخب کریں' : 'Choose Inquiry Category'}
            </p>
            {quickMessages.map((msg) => {
              const Icon = msg.icon;
              return (
                <button
                  key={msg.id}
                  onClick={() => handleOpenWhatsApp(msg.text)}
                  className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-[#EAF8F8] transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#009C9A]/15 text-[#073B73] group-hover:text-[#009C9A] flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#073B73] leading-snug">
                        {msg.title}
                      </h5>
                      <p className="text-[10px] text-slate-500">{msg.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#009C9A] transition-colors shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              WhatsApp: <strong className="text-slate-900 tabular-nums">{settings.whatsappNumber}</strong>
            </span>
            <button
              onClick={() => handleOpenWhatsApp('Hello Aitemad Diagnostic Center')}
              className="text-[#009C9A] font-bold hover:underline"
            >
              {isUrdu ? 'میسج بھیجیں' : 'Open Chat'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95"
        aria-label="Contact clinic on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white shrink-0" />
        <span className="text-xs font-bold whitespace-nowrap hidden sm:inline tracking-wide">
          {isUrdu ? 'واٹس ایپ پر رابطہ کریں' : 'WhatsApp Support'}
        </span>
      </button>
    </div>
  );
};
