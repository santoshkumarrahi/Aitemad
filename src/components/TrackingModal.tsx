import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Building2, 
  User, 
  PhoneCall,
  RotateCcw,
  Ban
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { AppointmentStatus, WebsiteSettings } from '../types/index.ts';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const { isUrdu, t } = useLanguage();
  const [bookingRef, setBookingRef] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any | null>(null);

  // Cancellation / Reschedule states
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setBookingData(null);
    setActionSuccessMsg(null);

    try {
      const response = await fetch('/api/appointments/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingRef: bookingRef.trim(),
          phone: phone.trim() || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Appointment not found');
      }

      setBookingData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to track appointment. Please check your reference code.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!bookingData) return;
    setLoading(true);
    try {
      const cleanNum = settings.whatsappNumber.replace(/\D/g, '');
      const phoneIntl = cleanNum.startsWith('0') ? '92' + cleanNum.slice(1) : cleanNum;
      const text = encodeURIComponent(
        `Hello Aitemad Lab, I would like to request cancellation for Appointment Ref *${bookingData.bookingRef}* (${bookingData.patientName}). Reason: ${cancelReason || 'Personal conflict'}.`
      );
      window.open(`https://wa.me/${phoneIntl}?text=${text}`, '_blank');
      setActionSuccessMsg('Cancellation request opened in WhatsApp for administrative processing.');
      setShowCancelPrompt(false);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rescheduled':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#073B73] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-[#F6C945]" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                {t.trackTitle}
              </h3>
              <p className="text-[11px] text-cyan-200">
                {isUrdu ? 'اعتماد ڈائیگنوسٹک سینٹر راولپنڈی' : 'Aitemad Diagnostic Center Real-Time Status'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          <form onSubmit={handleTrack} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isUrdu ? 'بکنگ ریفرنس نمبر' : 'Booking Reference'} *
              </label>
              <input
                type="text"
                placeholder="e.g. AIT-2026-7821"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono tracking-wider focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isUrdu ? 'رجسٹرڈ موبائل نمبر' : 'Registered Phone Number (Optional)'}
              </label>
              <input
                type="tel"
                placeholder="e.g. 0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#009C9A] hover:bg-[#008381] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{t.trackButton}</span>
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {actionSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {/* Result Card */}
          {bookingData && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-mono font-bold text-xs text-[#073B73]">
                  {bookingData.bookingRef}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusColor(bookingData.status)}`}>
                  {bookingData.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Patient:</span>
                  <strong className="text-slate-800">{bookingData.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Department:</span>
                  <strong className="text-slate-800">{bookingData.department}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Date & Time:</span>
                  <strong className="text-slate-800 tabular-nums">{bookingData.appointmentDate} at {bookingData.timeSlot}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Visit Type:</span>
                  <span className="text-slate-800">{bookingData.appointmentType}</span>
                </div>
                {bookingData.doctorName && (
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[11px]">Doctor:</span>
                    <strong className="text-slate-800">{bookingData.doctorName}</strong>
                  </div>
                )}
                {bookingData.testNames && bookingData.testNames.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[11px]">Scheduled Tests:</span>
                    <span className="text-slate-800">{bookingData.testNames.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Status Advice */}
              <div className="bg-white p-3 rounded-lg border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#009C9A] shrink-0 mt-0.5" />
                <span>
                  {bookingData.status === 'Pending' && 'Your appointment request is awaiting admin verification. You will receive an SMS/WhatsApp notification once confirmed.'}
                  {bookingData.status === 'Confirmed' && 'Your slot is confirmed. Please arrive 10 minutes before your scheduled appointment time.'}
                  {bookingData.status === 'Completed' && 'This appointment has been marked as completed. Thank you for choosing Aitemad Diagnostic Center.'}
                  {bookingData.status === 'Cancelled' && 'This booking was cancelled. Feel free to schedule a fresh appointment.'}
                </span>
              </div>

              {/* Actions: Cancel or Reschedule */}
              {bookingData.status !== 'Cancelled' && bookingData.status !== 'Completed' && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  {!showCancelPrompt ? (
                    <button
                      type="button"
                      onClick={() => setShowCancelPrompt(true)}
                      className="text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Request Cancellation</span>
                    </button>
                  ) : (
                    <div className="w-full space-y-2">
                      <input
                        type="text"
                        placeholder="Reason for cancellation..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleCancelRequest}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Confirm via WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCancelPrompt(false)}
                          className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  <a
                    href={`tel:${settings.phonePrimary}`}
                    className="text-xs font-semibold text-[#073B73] hover:underline flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3 text-[#009C9A]" />
                    <span>Call Helpline</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
