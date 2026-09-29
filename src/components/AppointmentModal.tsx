import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Stethoscope, 
  FlaskConical, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Share2,
  Home,
  Building2
} from 'lucide-react';
import { Department, Doctor, LaboratoryTest, Appointment, AppointmentType, WebsiteSettings } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  doctors: Doctor[];
  tests: LaboratoryTest[];
  settings: WebsiteSettings;
  preselectedDepartment?: string;
  preselectedDoctorId?: string;
  preselectedTestId?: string;
  onBookingComplete?: (appointment: Appointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  departments,
  doctors,
  tests,
  settings,
  preselectedDepartment,
  preselectedDoctorId,
  preselectedTestId,
  onBookingComplete,
}) => {
  const { isUrdu, t } = useLanguage();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  
  const [selectedDept, setSelectedDept] = useState<string>(preselectedDepartment || (departments[0]?.name || 'OPD'));
  const [selectedDocId, setSelectedDocId] = useState<string>(preselectedDoctorId || '');
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>(preselectedTestId ? [preselectedTestId] : []);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [appointmentDate, setAppointmentDate] = useState<string>(todayStr);
  const [timeSlot, setTimeSlot] = useState<string>('10:30 AM');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('Clinic Visit');
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  // Filter available doctors by chosen department
  const filteredDoctors = doctors.filter(d => 
    d.department.toLowerCase().includes(selectedDept.toLowerCase()) ||
    selectedDept.toLowerCase().includes(d.department.toLowerCase())
  );

  const availableSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM'
  ];

  const toggleTestSelection = (testId: string) => {
    setSelectedTestIds(prev => 
      prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!patientName.trim() || !patientPhone.trim() || !appointmentDate || !timeSlot) {
      setErrorMsg(isUrdu ? 'برائے مہربانی تمام ضروری خانے پر کریں۔' : 'Please fill all required fields.');
      return;
    }

    if (appointmentType === 'Home Sample Collection' && !homeAddress.trim()) {
      setErrorMsg(isUrdu ? 'گھر سے نمونہ حاصل کرنے کے لیے گھر کا پتہ ضروری ہے۔' : 'Home address is required for sample collection.');
      return;
    }

    const selectedDoc = doctors.find(d => d.id === selectedDocId);
    const selectedTestObjects = tests.filter(t => selectedTestIds.includes(t.id));

    setLoading(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientName.trim(),
          patientPhone: patientPhone.trim(),
          patientEmail: patientEmail.trim() || undefined,
          age: age ? Number(age) : undefined,
          gender,
          department: selectedDept,
          doctorId: selectedDoc?.id,
          doctorName: selectedDoc?.name,
          testIds: selectedTestIds,
          testNames: selectedTestObjects.map(t => t.name),
          appointmentDate,
          timeSlot,
          appointmentType,
          homeAddress: appointmentType === 'Home Sample Collection' ? homeAddress.trim() : undefined,
          notes: notes.trim() || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule appointment');
      }

      setConfirmedBooking(data.appointment);
      setStep('success');
      onBookingComplete?.(data.appointment);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!confirmedBooking) return;
    const msg = `*Aitemad Diagnostic Center Booking Confirmation*%0A` +
      `Booking Ref: *${confirmedBooking.bookingRef}*%0A` +
      `Patient Name: ${confirmedBooking.patientName}%0A` +
      `Department: ${confirmedBooking.department}%0A` +
      `Date: ${confirmedBooking.appointmentDate}%0A` +
      `Time Slot: ${confirmedBooking.timeSlot}%0A` +
      `Type: ${confirmedBooking.appointmentType}%0A` +
      `Location: Bangash Street, near Begum Rukhsana Memorial Hospital, Car Chowk, Rawalpindi.`;

    const cleanNum = settings.whatsappNumber.replace(/\D/g, '');
    const phoneIntl = cleanNum.startsWith('0') ? '92' + cleanNum.slice(1) : cleanNum;
    window.open(`https://wa.me/${phoneIntl}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#073B73] to-[#009C9A] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F6C945]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
                {isUrdu ? 'آن لائن اپائنٹمنٹ بکنگ' : 'Book Medical Appointment'}
              </h3>
              <p className="text-xs text-cyan-100">
                {isUrdu ? 'اعتماد ڈائیگنوسٹک سینٹر اینڈ کلینیکل لیب، راولپنڈی' : 'Aitemad Diagnostic Center & Clinical Lab'}
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

        {/* Modal Content */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Appointment Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isUrdu ? 'اپائنٹمنٹ کا طریقہ کار' : 'Appointment Type'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAppointmentType('Clinic Visit')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      appointmentType === 'Clinic Visit'
                        ? 'bg-[#EAF8F8] border-[#009C9A] text-[#073B73] shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#009C9A]" />
                    <span>{t.clinicVisit}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentType('Home Sample Collection')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      appointmentType === 'Home Sample Collection'
                        ? 'bg-[#EAF8F8] border-[#009C9A] text-[#073B73] shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home className="w-4 h-4 text-[#009C9A]" />
                    <span>{t.homeCollection}</span>
                  </button>
                </div>
              </div>

              {/* Department & Doctor Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.selectDepartment} *
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(e.target.value);
                      setSelectedDocId('');
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A] focus:ring-1 focus:ring-[#009C9A]"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {isUrdu ? d.nameUrdu : d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.selectDoctor}
                  </label>
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A] focus:ring-1 focus:ring-[#009C9A]"
                  >
                    <option value="">
                      {isUrdu ? '-- کوئی بھی دستیاب کنسلٹنٹ --' : '-- Any Available Specialist --'}
                    </option>
                    {filteredDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {isUrdu ? doc.nameUrdu : doc.name} ({doc.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lab Tests Selection (Visible especially for Laboratory department or optional tests) */}
              {(selectedDept.toLowerCase().includes('lab') || appointmentType === 'Home Sample Collection') && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-[#009C9A]" />
                      <span>{isUrdu ? 'مطلوبہ لیبارٹری ٹیسٹ منتخب کریں (40% رعایت)' : 'Select Diagnostic Tests (40% OFF)'}</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {selectedTestIds.length} {isUrdu ? 'ٹیسٹ منتخب' : 'selected'}
                    </span>
                  </div>
                  <div className="max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {tests.slice(0, 10).map((tst) => {
                      const isChecked = selectedTestIds.includes(tst.id);
                      return (
                        <button
                          key={tst.id}
                          type="button"
                          onClick={() => toggleTestSelection(tst.id)}
                          className={`text-left p-2 rounded-lg text-xs border transition-colors flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-[#EAF8F8] border-[#009C9A] text-[#073B73] font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate pr-2">{isUrdu ? tst.nameUrdu : tst.name}</span>
                          <span className="text-[#009C9A] tabular-nums font-bold shrink-0">
                            Rs.{tst.discountedPrice}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.appointmentDate} *
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A] focus:ring-1 focus:ring-[#009C9A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.timeSlot} *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A] focus:ring-1 focus:ring-[#009C9A]"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Patient Personal Details */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {isUrdu ? 'مریض کی تفصیلات' : 'Patient Information'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {t.patientName} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Muhammad Tahir"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {t.phone} *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="0300-1234567"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {t.gender}
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                    >
                      <option value="Male">{t.male}</option>
                      <option value="Female">{t.female}</option>
                      <option value="Other">{t.other}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {t.age} (Years)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 35"
                      min={1}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {t.email}
                    </label>
                    <input
                      type="email"
                      placeholder="patient@gmail.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                    />
                  </div>
                </div>

                {/* Home Address if Home Sample Collection */}
                {appointmentType === 'Home Sample Collection' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {t.homeAddress} *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="House / Street / Sector, Rawalpindi"
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {t.notes}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe your symptoms or specific instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#073B73] to-[#009C9A] hover:from-[#052d59] hover:to-[#008381] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-[#073B73]/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#F6C945]" />
                      <span>{t.submitBooking}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success Confirmation Screen */
            <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {isUrdu ? 'آپ کی بکنگ کامیابی سے موصول ہو گئی ہے!' : 'Appointment Successfully Scheduled!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  {isUrdu 
                    ? 'ہمارا میڈیکل عملہ فوری طور پر فون یا واٹس ایپ کے ذریعے آپ کی بکنگ کی تصدیق کرے گا۔'
                    : 'Our clinical desk will verify your slot and update you via SMS / WhatsApp.'}
                </p>
              </div>

              {/* Booking Card */}
              {confirmedBooking && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 max-w-md mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-xs text-slate-500 font-semibold uppercase">Booking Reference</span>
                    <span className="font-mono font-bold text-sm text-[#073B73] bg-[#EAF8F8] px-2.5 py-1 rounded-md">
                      {confirmedBooking.bookingRef}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Patient Name:</span>
                      <strong className="text-slate-900">{confirmedBooking.patientName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Phone:</span>
                      <strong className="text-slate-900 tabular-nums">{confirmedBooking.patientPhone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Department:</span>
                      <strong className="text-slate-900">{confirmedBooking.department}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Date & Time:</span>
                      <strong className="text-slate-900">{confirmedBooking.appointmentDate} at {confirmedBooking.timeSlot}</strong>
                    </div>
                    {confirmedBooking.doctorName && (
                      <div className="col-span-2">
                        <span className="text-slate-500 block">Doctor:</span>
                        <strong className="text-slate-900">{confirmedBooking.doctorName}</strong>
                      </div>
                    )}
                    {confirmedBooking.testNames && confirmedBooking.testNames.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-slate-500 block">Selected Tests:</span>
                        <span className="text-slate-800 font-medium">{confirmedBooking.testNames.join(', ')}</span>
                      </div>
                    )}
                    {confirmedBooking.homeAddress && (
                      <div className="col-span-2">
                        <span className="text-slate-500 block">Collection Address:</span>
                        <span className="text-slate-800">{confirmedBooking.homeAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send to Clinic WhatsApp</span>
                </button>

                <button
                  onClick={handlePrintReceipt}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>

                <button
                  onClick={() => {
                    setStep('form');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#073B73] hover:bg-[#052d59] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
