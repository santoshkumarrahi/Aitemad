import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton.tsx';
import { AppointmentModal } from './components/AppointmentModal.tsx';
import { TrackingModal } from './components/TrackingModal.tsx';
import { PatientPortalModal } from './components/PatientPortalModal.tsx';
import { MediaModal } from './components/MediaModal.tsx';

import { HomeView } from './views/HomeView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { ServicesView } from './views/ServicesView.tsx';
import { TestsView } from './views/TestsView.tsx';
import { DoctorsView } from './views/DoctorsView.tsx';
import { OffersView } from './views/OffersView.tsx';
import { GalleryView } from './views/GalleryView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { AdminView } from './views/AdminView.tsx';

import { 
  WebsiteSettings, 
  Department, 
  Doctor, 
  LaboratoryTest, 
  TestPackage, 
  GalleryMediaItem 
} from './types/index.ts';

const fallbackSettings: WebsiteSettings = {
  clinicName: "Aitemad Diagnostic Center & Clinical Lab",
  clinicNameUrdu: "اعتماد ڈائیگنوسٹک سینٹر اینڈ کلینیکل لیب",
  tagline: "Trusted Results, Accurate Diagnosis",
  taglineUrdu: "قابل اعتماد نتائج، درست تشخیص",
  slogan: "Best Healthcare Services",
  sloganUrdu: "بہترین صحت کی دیکھ بھال کی خدمات",
  description: "Your health is our priority. Get convenient access to professional healthcare, diagnostic laboratory testing, outpatient consultation, and specialist services in Rawalpindi.",
  descriptionUrdu: "آپ کی صحت ہماری اولین ترجیح ہے۔ پیشہ ورانہ صحت کی دیکھ بھال، تشخیصی لیبارٹری ٹیسٹنگ، آؤٹ پیشنٹ مشاورت اور ماہر ڈاکٹرز کی خدمات تک آسان رسائی حاصل کریں۔",
  address: "Bangash Street, near Begum Rukhsana Memorial Hospital, Car Chowk, Gulraiz Phase 6, Bostan Khan Road, Dhok Choudrian, Rawalpindi, Pakistan",
  addressUrdu: "بنگش سٹریٹ، نزد بیگم رخسانہ میموریل ہسپتال، کار چوک، گلریز فیز 6، بوستان خان روڈ، ڈھوک چوہدریاں، راولپنڈی",
  phonePrimary: "051-5595404",
  phoneSecondary: "0311-8302933",
  whatsappNumber: "03403766768",
  whatsappNumberAlt: "0311-8302933",
  email: "info@aitemadlab.com",
  websiteUrl: "https://www.aitemadlab.com",
  hoursWeekdays: "Mon - Sat: 8:00 AM - 10:00 PM",
  hoursSunday: "Sunday: 9:00 AM - 5:00 PM",
  emergencyService: "24/7 Emergency & Diagnostic Laboratory Available",
  emergencyServiceUrdu: "24 گھنٹے ایمرجنسی اور تشخیصی لیبارٹری دستیاب ہے",
  googleMapsUrl: "https://maps.google.com/?q=Begum+Rukhsana+Memorial+Hospital+Car+Chowk+Rawalpindi",
  googleMapsEmbed: "https://maps.google.com/maps?q=Car%20Chowk,%20Gulraiz%20Rawalpindi&t=&z=15&ie=UTF8&iwloc=&output=embed",
  discountPercentage: 40,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [settings, setSettings] = useState<WebsiteSettings>(fallbackSettings);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [tests, setTests] = useState<LaboratoryTest[]>([]);
  const [packages, setPackages] = useState<TestPackage[]>([]);
  const [gallery, setGallery] = useState<GalleryMediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedDept, setPreselectedDept] = useState<string | undefined>(undefined);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | undefined>(undefined);
  const [preselectedTestId, setPreselectedTestId] = useState<string | undefined>(undefined);

  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [portalModalOpen, setPortalModalOpen] = useState(false);
  const [selectedMediaItem, setSelectedMediaItem] = useState<GalleryMediaItem | null>(null);

  // Load backend data
  const loadData = async () => {
    try {
      const [resSettings, resDepts, resDoctors, resTests, resPackages, resGallery] = await Promise.all([
        fetch('/api/settings').then(r => r.json()).catch(() => fallbackSettings),
        fetch('/api/departments').then(r => r.json()).catch(() => []),
        fetch('/api/doctors').then(r => r.json()).catch(() => []),
        fetch('/api/tests').then(r => r.json()).catch(() => []),
        fetch('/api/packages').then(r => r.json()).catch(() => []),
        fetch('/api/gallery').then(r => r.json()).catch(() => [])
      ]);

      if (resSettings && resSettings.clinicName) setSettings(resSettings);
      if (Array.isArray(resDepts) && resDepts.length > 0) setDepartments(resDepts);
      if (Array.isArray(resDoctors) && resDoctors.length > 0) setDoctors(resDoctors);
      if (Array.isArray(resTests) && resTests.length > 0) setTests(resTests);
      if (Array.isArray(resPackages) && resPackages.length > 0) setPackages(resPackages);
      if (Array.isArray(resGallery) && resGallery.length > 0) setGallery(resGallery);
    } catch (e) {
      console.error('Error loading initial clinic data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenBooking = (dept?: string, doctorId?: string, testId?: string) => {
    setPreselectedDept(dept);
    setPreselectedDoctorId(doctorId);
    setPreselectedTestId(testId);
    setBookingModalOpen(true);
  };

  const handleUpdateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#009C9A]/20 selection:text-[#073B73]">
        {/* Navigation Bar */}
        <Navbar
          settings={settings}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenBooking={() => handleOpenBooking()}
          onOpenTracking={() => setTrackingModalOpen(true)}
          onOpenPortal={() => setPortalModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomeView
              settings={settings}
              departments={departments}
              doctors={doctors}
              tests={tests}
              packages={packages}
              gallery={gallery}
              onOpenBooking={handleOpenBooking}
              onNavigateTab={setActiveTab}
              onSelectMedia={(item) => setSelectedMediaItem(item)}
            />
          )}

          {activeTab === 'about' && (
            <AboutView
              settings={settings}
              onOpenBooking={() => handleOpenBooking()}
            />
          )}

          {activeTab === 'services' && (
            <ServicesView
              departments={departments}
              settings={settings}
              onOpenBooking={handleOpenBooking}
            />
          )}

          {activeTab === 'tests' && (
            <TestsView
              tests={tests}
              settings={settings}
              onOpenBooking={handleOpenBooking}
            />
          )}

          {activeTab === 'doctors' && (
            <DoctorsView
              doctors={doctors}
              onOpenBooking={handleOpenBooking}
            />
          )}

          {activeTab === 'offers' && (
            <OffersView
              packages={packages}
              settings={settings}
              onOpenBooking={handleOpenBooking}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryView
              gallery={gallery}
              onSelectMedia={(item) => setSelectedMediaItem(item)}
            />
          )}

          {activeTab === 'contact' && (
            <ContactView settings={settings} />
          )}

          {activeTab === 'admin' && (
            <AdminView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </main>

        {/* Global Footer (shown on public pages) */}
        {activeTab !== 'admin' && (
          <Footer
            settings={settings}
            onNavigateTab={setActiveTab}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {/* Floating WhatsApp Quick Action Button */}
        <WhatsAppFloatingButton settings={settings} />

        {/* Appointment Booking Modal */}
        <AppointmentModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          departments={departments}
          doctors={doctors}
          tests={tests}
          settings={settings}
          preselectedDepartment={preselectedDept}
          preselectedDoctorId={preselectedDoctorId}
          preselectedTestId={preselectedTestId}
          onBookingComplete={() => loadData()}
        />

        {/* Appointment Tracking Modal */}
        <TrackingModal
          isOpen={trackingModalOpen}
          onClose={() => setTrackingModalOpen(false)}
          settings={settings}
        />

        {/* Patient Portal Modal with Downloadable PDF Lab Reports */}
        <PatientPortalModal
          isOpen={portalModalOpen}
          onClose={() => setPortalModalOpen(false)}
          settings={settings}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Media Lightbox Modal */}
        <MediaModal
          item={selectedMediaItem}
          onClose={() => setSelectedMediaItem(null)}
        />
      </div>
    </LanguageProvider>
  );
}
