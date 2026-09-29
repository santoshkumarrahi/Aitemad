import React from 'react';
import { Clock, Calendar, CheckCircle2, Award, Phone } from 'lucide-react';
import { Doctor } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface DoctorsViewProps {
  doctors: Doctor[];
  onOpenBooking: (dept?: string, docId?: string) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({ doctors, onOpenBooking }) => {
  const { isUrdu, t } = useLanguage();

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-[#009C9A] bg-[#EAF8F8] px-3 py-1 rounded-md">
          {isUrdu ? 'کنسلٹنٹ ڈاکٹرز' : 'Our Medical Faculty'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#073B73]">
          {t.doctorsTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isUrdu 
            ? 'اعتماد ڈائیگنوسٹک سینٹر کے تجربہ کار سپیشلسٹس اور کنسلٹنٹس جو آپ کی صحت کی مکمل رہنمائی کے لیے ہمہ وقت تیار ہیں۔'
            : 'Access experienced physicians, gynecologists, and pathologists dedicated to patient-centered clinical excellence.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="p-6 sm:p-7 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#073B73] to-[#009C9A] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                  {doc.name.replace('Dr. ', '').charAt(0)}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#009C9A] uppercase tracking-wider block">
                    {isUrdu ? doc.departmentUrdu : doc.department}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                    {isUrdu ? doc.nameUrdu : doc.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {doc.qualifications}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">
                  Specialization: <span className="font-normal text-slate-600">{isUrdu ? doc.specializationUrdu : doc.specialization}</span>
                </p>
                <p className="leading-relaxed text-slate-500">
                  {isUrdu ? doc.bioUrdu : doc.bio}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400 font-semibold">Consultation Days:</span>
                  <strong className="text-slate-900">{isUrdu ? doc.consultationDaysUrdu : doc.consultationDays.join(', ')}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400 font-semibold">Hours:</span>
                  <span className="tabular-nums font-medium text-slate-800">{doc.consultationHours}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200">
                  <span className="text-slate-400 font-semibold">Consultation Fee:</span>
                  <strong className="text-[#073B73] font-bold text-sm tabular-nums">Rs. {doc.fee}</strong>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
              <button
                onClick={() => onOpenBooking(doc.department, doc.id)}
                className="w-full py-2.5 bg-[#073B73] hover:bg-[#009C9A] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
