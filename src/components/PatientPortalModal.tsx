import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { 
  X, 
  User, 
  FileText, 
  Calendar, 
  Download, 
  Phone, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Appointment, LaboratoryReport, Patient, WebsiteSettings } from '../types/index.ts';

interface PatientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
  onOpenBooking: () => void;
}

export const PatientPortalModal: React.FC<PatientPortalModalProps> = ({
  isOpen,
  onClose,
  settings,
  onOpenBooking,
}) => {
  const { isUrdu } = useLanguage();

  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Authenticated state
  const [patient, setPatient] = useState<Patient | null>(() => {
    const saved = localStorage.getItem('aitemad_patient_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<LaboratoryReport[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'reports'>('appointments');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/patient/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneInput.trim() })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      setPatient(data.patient);
      setAppointments(data.appointments || []);
      setReports(data.reports || []);
      localStorage.setItem('aitemad_patient_session', JSON.stringify(data.patient));
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to sign in. Please verify your phone number.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setPatient(null);
    setAppointments([]);
    setReports([]);
    localStorage.removeItem('aitemad_patient_session');
  };

  // Generate and Download Official PDF Laboratory Report
  const handleDownloadPDF = (report: LaboratoryReport) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [7, 59, 115]; // #073B73
    const tealColor = [0, 156, 154];    // #009C9A

    // Header Background Accent Bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 26, 'F');

    // Letterhead text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('AITEMAD DIAGNOSTIC CENTER & CLINICAL LAB', 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Trusted Results, Accurate Diagnosis · 24/7 Diagnostic & Clinical Pathology Services', 14, 19);

    // Contact Subheader
    doc.setFillColor(234, 248, 248);
    doc.rect(0, 26, 210, 12, 'F');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);
    doc.text(
      'Bangash Street, near Begum Rukhsana Hospital, Car Chowk, Rawalpindi | Tel: 051-5595404, 0311-8302933',
      14,
      33
    );

    // Report Title Banner
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('CONFIDENTIAL CLINICAL LABORATORY REPORT', 14, 47);

    // Patient & Sample Information Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 52, 182, 34, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);

    // Column 1
    doc.setFont('helvetica', 'bold');
    doc.text('Report No:', 18, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(report.reportNumber, 42, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Patient Name:', 18, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(report.patientName, 42, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Phone No:', 18, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(report.patientPhone, 42, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Age / Gender:', 18, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`${report.patientAge || 'Adult'} Y / ${report.patientGender || 'N/A'}`, 42, 80);

    // Column 2
    doc.setFont('helvetica', 'bold');
    doc.text('Test Category:', 110, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(report.testCategory, 140, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('Booking Ref:', 110, 66);
    doc.setFont('helvetica', 'normal');
    doc.text(report.appointmentRef || 'Walk-in', 140, 66);

    doc.setFont('helvetica', 'bold');
    doc.text('Report Date:', 110, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(report.reportDate, 140, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Verified By:', 110, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(report.pathologistName || 'Consultant Pathologist', 140, 80);

    // Investigation Heading
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(tealColor[0], tealColor[1], tealColor[2]);
    doc.text(`INVESTIGATION: ${report.testName.toUpperCase()}`, 14, 95);

    // Table Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(14, 99, 182, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('TEST PARAMETER', 18, 104.5);
    doc.text('RESULT', 95, 104.5);
    doc.text('UNIT', 125, 104.5);
    doc.text('BIOLOGICAL REFERENCE INTERVAL', 145, 104.5);

    // Results Table Rows
    let startY = 113;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    report.results.forEach((item, idx) => {
      // Row alternating background
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, startY - 4.5, 182, 8, 'F');
      }

      doc.setTextColor(30, 41, 59);
      doc.text(item.parameter, 18, startY);

      // Flag coloring
      if (item.flag === 'High' || item.flag === 'Low') {
        doc.setTextColor(220, 38, 38);
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.value} (${item.flag})`, 95, startY);
        doc.setFont('helvetica', 'normal');
      } else {
        doc.setTextColor(15, 23, 42);
        doc.text(item.value, 95, startY);
      }

      doc.setTextColor(71, 85, 105);
      doc.text(item.unit, 125, startY);
      doc.text(item.referenceRange, 145, startY);

      startY += 8;
    });

    // Remarks & Clinical Note
    startY += 8;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, startY, 196, startY);
    startY += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('CLINICAL PATHOLOGY REMARKS:', 14, startY);

    startY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitRemarks = doc.splitTextToSize(report.doctorRemarks || 'Results correlate with automated analyzer clinical limits. Advised clinical correlation with attending physician.', 180);
    doc.text(splitRemarks, 14, startY);

    // Signatures Block
    const signY = 250;
    doc.setDrawColor(203, 213, 225);
    doc.line(20, signY, 70, signY);
    doc.line(140, signY, 190, signY);

    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('Medical Technologist', 25, signY + 5);
    doc.text('Dr. Sajid Mehmood (M.Phil Haematology)', 132, signY + 5);
    doc.text('Head Pathologist & Lab Director', 140, signY + 9);

    // Footer Disclaimer & QR verification notice
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 275, 210, 22, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'This report is generated digitally by Aitemad Diagnostic Center & Clinical Lab. Authenticity verified.',
      14,
      282
    );
    doc.text(
      'Notice: Laboratory test results must be interpreted by a registered medical practitioner in conjunction with patient history.',
      14,
      287
    );

    // Trigger Download
    doc.save(`Aitemad-Report-${report.reportNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#073B73] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F6C945]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                {isUrdu ? 'مریض پورٹل اور رپورٹس' : 'Patient Health Portal'}
              </h3>
              <p className="text-[11px] text-cyan-200">
                {isUrdu ? 'اعتماد ڈائیگنوسٹک سینٹر راولپنڈی' : 'Aitemad Diagnostic Center & Clinical Lab'}
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
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          {!patient ? (
            /* Login with Phone Number */
            <div className="max-w-md mx-auto py-6 space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-[#EAF8F8] text-[#009C9A] flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-lg text-slate-800">
                  {isUrdu ? 'مریض لاگ ان' : 'Sign in to Patient Portal'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isUrdu 
                    ? 'اپنی تمام لیب رپورٹس اور اپائنٹمنٹ ریکارڈ دیکھنے کے لیے اپنا موبائل نمبر درج کریں۔'
                    : 'Enter your registered mobile phone number to view test reports and appointment records.'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isUrdu ? 'موبائل فون نمبر' : 'Mobile Phone Number'} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="e.g. 0300-5544332 or 0311-8302933"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#009C9A] hover:bg-[#008381] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Access My Records</span>
                  )}
                </button>
              </form>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                <span>Haven't booked an appointment yet? </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="text-[#073B73] font-bold hover:underline ml-1"
                >
                  Book New Appointment
                </button>
              </div>
            </div>
          ) : (
            /* Authenticated Portal Dashboard */
            <div className="space-y-6">
              {/* Profile Card & Session */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#073B73] to-[#009C9A] text-white flex items-center justify-center font-bold text-lg">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                      {patient.name}
                    </h4>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {patient.phone} {patient.gender ? `· ${patient.gender}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBooking();
                    }}
                    className="px-3 py-1.5 bg-[#009C9A] hover:bg-[#008381] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    + Book New Visit
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Portal Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    activeTab === 'appointments'
                      ? 'bg-[#073B73] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Appointments ({appointments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    activeTab === 'reports'
                      ? 'bg-[#073B73] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Lab Reports ({reports.length})</span>
                </button>
              </div>

              {/* Tab 1: Appointments List */}
              {activeTab === 'appointments' && (
                <div className="space-y-3">
                  {appointments.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No scheduled appointments found under this phone number.</p>
                    </div>
                  ) : (
                    appointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors flex flex-wrap items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#073B73] bg-[#EAF8F8] px-2 py-0.5 rounded-sm">
                              {apt.bookingRef}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              apt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                              apt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-800 text-sm">
                            {apt.department} {apt.doctorName ? `— ${apt.doctorName}` : ''}
                          </h5>
                          <p className="text-xs text-slate-500 flex items-center gap-3">
                            <span>📅 {apt.appointmentDate} at {apt.timeSlot}</span>
                            <span>📍 {apt.appointmentType}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 block">Booked on {apt.createdAt.split('T')[0]}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Lab Reports List */}
              {activeTab === 'reports' && (
                <div className="space-y-3">
                  {reports.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No diagnostic laboratory reports currently released.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Reports are uploaded as soon as automated analysis is completed.</p>
                    </div>
                  ) : (
                    reports.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors flex flex-wrap items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#009C9A] bg-[#EAF8F8] px-2 py-0.5 rounded-sm">
                              {rep.reportNumber}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              Date: {rep.reportDate}
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-900 text-sm">
                            {rep.testName}
                          </h5>
                          <p className="text-xs text-slate-500">
                            Category: {rep.testCategory} · Verified by {rep.pathologistName}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDownloadPDF(rep)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#073B73] to-[#009C9A] hover:from-[#052d59] hover:to-[#008381] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF Report</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
