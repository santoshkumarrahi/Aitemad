import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface ContactViewProps {
  settings: WebsiteSettings;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings }) => {
  const { isUrdu } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Healthcare Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cleanWhatsApp = settings.whatsappNumber.replace(/\D/g, '');
  const phoneIntl = cleanWhatsApp.startsWith('0') ? '92' + cleanWhatsApp.slice(1) : cleanWhatsApp;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          subject,
          message: message.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send inquiry');
      }

      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit your message. Please reach us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-[#009C9A] bg-[#EAF8F8] px-3 py-1 rounded-md">
          {isUrdu ? 'ہم سے رابطہ کریں' : 'Get In Touch'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#073B73]">
          {isUrdu ? 'اعتماد ڈائیگنوسٹک سینٹر سے رابطہ' : 'Contact Us & Clinic Location'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isUrdu 
            ? 'کار چوک راولپنڈی میں ہمارے کلینک تشریف لائیں یا فون و واٹس ایپ کے ذریعے فوری رہنمائی حاصل کریں۔'
            : 'Visit our diagnostic center at Bangash Street near Car Chowk Rawalpindi, or reach our medical support desk.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-xl font-black text-[#073B73]">
              Clinic Contact Information
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EAF8F8] text-[#009C9A] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold">Physical Address:</strong>
                  <span className="text-slate-600 leading-relaxed block mt-0.5">
                    {isUrdu ? settings.addressUrdu : settings.address}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EAF8F8] text-[#073B73] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold">Direct Phone Helpline:</strong>
                  <a href={`tel:${settings.phonePrimary}`} className="tabular-nums font-semibold hover:text-[#009C9A] block">
                    {settings.phonePrimary}
                  </a>
                  <a href={`tel:${settings.phoneSecondary}`} className="tabular-nums font-semibold hover:text-[#009C9A] block">
                    {settings.phoneSecondary}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold">Official WhatsApp Support:</strong>
                  <a 
                    href={`https://wa.me/${phoneIntl}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="tabular-nums font-semibold text-[#25D366] hover:underline block"
                  >
                    {settings.whatsappNumber}
                  </a>
                  <span className="text-[11px] text-slate-400">Available for test reports, inquiries, and sample pickup</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EAF8F8] text-[#073B73] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold">Working Hours:</strong>
                  <span className="text-slate-600 block">{settings.hoursWeekdays}</span>
                  <span className="text-slate-600 block">{settings.hoursSunday}</span>
                  <span className="text-[#009C9A] font-bold block mt-1">24/7 Clinical Laboratory Testing</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#073B73] hover:bg-[#052d59] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Google Maps App</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Interactive Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-xl font-black text-[#073B73]">
              Send an Online Inquiry
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Have questions regarding test prices, doctor schedules, or home collection? Fill out this inquiry and our desk will respond.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been received. Our clinical coordinator will get back to you shortly.</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Asad Ali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                >
                  <option value="General Healthcare Inquiry">General Healthcare Inquiry</option>
                  <option value="OPD Doctor Consultation">OPD Doctor Consultation</option>
                  <option value="Laboratory Test & 40% OFF">Laboratory Test & 40% OFF Discount</option>
                  <option value="Specialist Appointment">Specialist Appointment</option>
                  <option value="Home Sample Collection">Home Sample Collection Request</option>
                  <option value="Pharmacy Inquiry">Pharmacy & Medicine Inquiry</option>
                  <option value="Trainee Hiring Application">Trainee Hiring Application</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Message / Health Query *
              </label>
              <textarea
                rows={4}
                placeholder="How can our clinical team help you today?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#073B73] to-[#009C9A] hover:from-[#052d59] hover:to-[#008381] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Embedded Map */}
      <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 h-96 w-full">
        <iframe
          title="Aitemad Diagnostic Center Map Rawalpindi"
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
  );
};
