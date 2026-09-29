import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Heart, 
  Microscope, 
  Calendar, 
  Clock, 
  Phone,
  Building,
  Target,
  Eye,
  Activity
} from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AboutViewProps {
  settings: WebsiteSettings;
  onOpenBooking: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ settings, onOpenBooking }) => {
  const { isUrdu } = useLanguage();

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-[#009C9A] bg-[#EAF8F8] px-3 py-1 rounded-md">
          {isUrdu ? 'ہمارے بارے میں' : 'About Our Clinic'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#073B73]">
          {isUrdu ? 'اعتماد ڈائیگنوسٹک سینٹر اینڈ کلینیکل لیب' : 'Aitemad Diagnostic Center & Clinical Lab'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isUrdu 
            ? 'راولپنڈی کے رہائشیوں کو بروقت، قابل اعتماد اور بین الاقوامی معیار کی تشخیصی و طبی سہولیات کی فراہمی۔'
            : 'Committed to delivering reliable clinical pathology, outpatient consultations, and specialized medical diagnostics with clinical integrity.'}
        </p>
      </div>

      {/* Main Philosophy & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#EAF8F8] text-[#073B73] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#073B73]">
            {isUrdu ? 'ہمارا مشن' : 'Our Mission'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isUrdu 
              ? 'ہر شہری کے لیے بغیر کسی تفریق کے درست ترین تشخیصی نتائج اور معیاری ادویات کی فراہمی یقینی بنانا۔'
              : 'To provide accurate, prompt, and affordable diagnostic investigations and outpatient clinical care that empowers doctors and patients to make sound healthcare decisions.'}
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#EAF8F8] text-[#009C9A] flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#073B73]">
            {isUrdu ? 'ہمارا وژن' : 'Our Vision'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isUrdu 
              ? 'راولپنڈی اور ملحقہ علاقوں میں سب سے زیادہ قابل اعتماد اور مریض دوست ہیلتھ کیئر سنٹر بننا۔'
              : 'To stand as the gold standard of diagnostic reliability, precision laboratory automation, and patient-centered clinical care in Rawalpindi and the twin cities region.'}
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#EAF8F8] text-[#F6C945] flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#073B73]">
            {isUrdu ? 'ہمارا فلسفہ' : 'Our Core Philosophy'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isUrdu 
              ? 'دیکھ بھال، درستگی، اعتماد — یہ تین ستون ہمارے ہر ٹیسٹ اور ہر نسخے کی بنیاد ہیں۔'
              : 'Care, Accuracy, Trust: Three foundational pillars that guide every blood draw, pathology analysis, and specialist patient consultation.'}
          </p>
        </div>
      </div>

      {/* Facility & Equipment Spotlight */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-black uppercase tracking-wider text-[#009C9A]">
            Modern Diagnostic Infrastructure
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#073B73] mt-1">
            Clinical Laboratory & Diagnostic Technology
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            We employ modern automated clinical analyzers and sterile sampling procedures to minimize pre-analytical errors and deliver results with high analytical sensitivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <Microscope className="w-8 h-8 text-[#009C9A]" />
            <h4 className="font-extrabold text-sm text-slate-900">DH-26 Automated Hematology</h4>
            <p className="text-xs text-slate-500">Automated 3-part / 5-part differential blood analyzer for rapid CBC with precision counting.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <Activity className="w-8 h-8 text-[#073B73]" />
            <h4 className="font-extrabold text-sm text-slate-900">Biochemistry & Chemistry</h4>
            <p className="text-xs text-slate-500">Photometric & enzymatic assay testing for accurate LFT, RFT, Lipid, and glucose profiles.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#009C9A]" />
            <h4 className="font-extrabold text-sm text-slate-900">Pathologist Supervision</h4>
            <p className="text-xs text-slate-500">All abnormal smears, peripheral films, and critical findings verified by consultant pathologist.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <Building className="w-8 h-8 text-[#073B73]" />
            <h4 className="font-extrabold text-sm text-slate-900">Hygienic Patient Suites</h4>
            <p className="text-xs text-slate-500">Air-conditioned examination rooms with sterilized beds, fresh disposable sheets, and patient privacy.</p>
          </div>
        </div>
      </div>

      {/* Visual Tour Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-[#009C9A]">
            Verified Clinic Details
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#073B73]">
            Serving Rawalpindi with Distinction
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Conveniently situated on Bangash Street near Begum Rukhsana Memorial Hospital, Car Chowk, Gulraiz Phase 6, our facility is easily accessible for residents of Gulraiz, Bostan Khan Road, Dhok Choudrian, High Court Road, and surrounding neighborhoods.
          </p>

          <div className="space-y-2 text-xs text-slate-700 pt-2">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#009C9A]" />
              <span>Full-time OPD consultation with experienced general physician</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#009C9A]" />
              <span>Specialist clinic for diabetes, hypertension, and internal medicine</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#009C9A]" />
              <span>Dedicated women's health and antenatal maternity care</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#009C9A]" />
              <span>Doorstep home sample collection for elderly and bed-bound patients</span>
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 bg-[#073B73] hover:bg-[#009C9A] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Book Your Visit Today
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-slate-100">
          <img
            src="/src/assets/images/hero_clinic_diagnostic_1790651599920.jpg"
            alt="Aitemad Diagnostic Center exterior"
            className="w-full h-80 object-cover"
          />
        </div>
      </div>
    </div>
  );
};
