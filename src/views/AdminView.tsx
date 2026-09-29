import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FlaskConical, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  Database, 
  History, 
  LogOut, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Check, 
  X, 
  Clock, 
  Phone, 
  AlertCircle,
  TrendingUp,
  Activity,
  Edit2,
  Trash2,
  Lock,
  Save,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { 
  Appointment, 
  Patient, 
  LaboratoryTest, 
  LaboratoryReport, 
  GalleryMediaItem, 
  WebsiteSettings, 
  AuditLogItem, 
  AppointmentStatus 
} from '../types/index.ts';

interface AdminViewProps {
  settings: WebsiteSettings;
  onUpdateSettings: (newSettings: Partial<WebsiteSettings>) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ settings, onUpdateSettings }) => {
  // Authentication
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('aitemad_admin_token'));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Admin Section
  const [activeSection, setActiveSection] = useState<'dashboard' | 'appointments' | 'patients' | 'tests' | 'reports' | 'gallery' | 'settings' | 'backup' | 'audit'>('dashboard');

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [tests, setTests] = useState<LaboratoryTest[]>([]);
  const [reports, setReports] = useState<LaboratoryReport[]>([]);
  const [gallery, setGallery] = useState<GalleryMediaItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters & Inputs
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editable settings local state
  const [editSettings, setEditSettings] = useState<WebsiteSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // New Test Modal / Form state
  const [showAddTest, setShowAddTest] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    nameUrdu: '',
    category: 'Routine Tests' as any,
    description: '',
    descriptionUrdu: '',
    originalPrice: 1000,
    discountedPrice: 600,
    sampleType: 'Blood',
    preparationInstructions: 'No fasting required',
    preparationInstructionsUrdu: 'کسی خاص پرہیز کی ضرورت نہیں ہے',
    deliveryTimeHours: '2 to 4 Hours',
    popular: true,
    isActive: true
  });

  // New Report Modal / Form state
  const [showAddReport, setShowAddReport] = useState(false);
  const [newReport, setNewReport] = useState({
    patientName: '',
    patientPhone: '',
    patientAge: 35,
    patientGender: 'Male',
    appointmentRef: '',
    testCategory: 'Hematology',
    testName: 'Complete Blood Count (CBC)',
    sampleCollectedAt: new Date().toISOString(),
    reportDate: new Date().toISOString().split('T')[0],
    pathologistName: 'Dr. Sajid Mehmood (M.Phil Haematology)',
    status: 'Ready' as const,
    results: [
      { parameter: 'Hemoglobin (Hb)', value: '13.5', unit: 'g/dL', referenceRange: '13.0 - 17.5', flag: 'Normal' as const },
      { parameter: 'Total Leukocyte Count (TLC)', value: '6,500', unit: '/cumm', referenceRange: '4,000 - 11,000', flag: 'Normal' as const },
      { parameter: 'Platelets Count', value: '280,000', unit: '/cumm', referenceRange: '150,000 - 450,000', flag: 'Normal' as const }
    ],
    doctorRemarks: 'Parameters are within biological reference limits.'
  });

  // Restore state
  const [restoreText, setRestoreText] = useState('');
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);

  // Fetch initial admin data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resStats, resApts, resPatients, resTests, resReports, resGallery, resLogs] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/appointments').then(r => r.json()),
        fetch('/api/patients').then(r => r.json()),
        fetch('/api/tests').then(r => r.json()),
        fetch('/api/reports').then(r => r.json()),
        fetch('/api/gallery').then(r => r.json()),
        fetch('/api/admin/audit-logs').then(r => r.json())
      ]);

      setStats(resStats);
      setAppointments(resApts);
      setPatients(resPatients);
      setTests(resTests);
      setReports(resReports);
      setGallery(resGallery);
      setAuditLogs(resLogs);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setAuthToken(data.token);
      localStorage.setItem('aitemad_admin_token', data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('aitemad_admin_token');
  };

  // Appointment Status Changes
  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editSettings)
      });
      if (res.ok) {
        onUpdateSettings(editSettings);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Test
  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest)
      });
      if (res.ok) {
        setShowAddTest(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Test
  const handleDeleteTest = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this test?')) return;
    try {
      const res = await fetch(`/api/tests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Report
  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });
      if (res.ok) {
        setShowAddReport(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Restore Backup
  const handleRestore = async () => {
    if (!restoreText.trim()) return;
    try {
      const res = await fetch('/api/admin/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupData: restoreText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRestoreMsg('Database restored successfully!');
      fetchData();
    } catch (err: any) {
      setRestoreMsg('Error: ' + err.message);
    }
  };

  // Login Screen if unauthenticated
  if (!authToken) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#073B73] to-[#009C9A] text-white flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-[#073B73]">
              Admin Control Panel
            </h2>
            <p className="text-xs text-slate-500">
              Aitemad Diagnostic Center & Clinical Lab, Rawalpindi
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Username / Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#073B73] to-[#009C9A] hover:from-[#052d59] hover:to-[#008381] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Secure Sign In
            </button>
          </form>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 text-center">
            Demo Administrator Access: <strong className="text-slate-800">admin</strong> / Password: <strong className="text-slate-800">aitemad2026</strong>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = appointmentFilter === 'all' || apt.status.toLowerCase() === appointmentFilter.toLowerCase();
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#073B73] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#F6C945]" />
          <div>
            <h1 className="text-base sm:text-lg font-black leading-tight">
              Aitemad Health Admin Console
            </h1>
            <p className="text-[11px] text-cyan-200">
              Rawalpindi Diagnostic Center & Clinical Lab Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-1.5 text-cyan-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs"
            title="Refresh Data"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-1.5 shrink-0">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSection === 'dashboard' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveSection('appointments')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSection === 'appointments' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" />
              <span>Appointments</span>
            </div>
            {stats?.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
                {stats.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('patients')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSection === 'patients' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registered Patients</span>
          </button>

          <button
            onClick={() => setActiveSection('tests')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSection === 'tests' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Laboratory Tests</span>
          </button>

          <button
            onClick={() => setActiveSection('reports')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSection === 'reports' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Digital Lab Reports</span>
          </button>

          <button
            onClick={() => setActiveSection('gallery')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSection === 'gallery' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media & Gallery</span>
          </button>

          <div className="pt-3 border-t border-slate-200 mt-3 space-y-1.5">
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeSection === 'settings' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website & Contact Info</span>
            </button>

            <button
              onClick={() => setActiveSection('backup')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeSection === 'backup' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Backup & Restore</span>
            </button>

            <button
              onClick={() => setActiveSection('audit')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeSection === 'audit' ? 'bg-[#073B73] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Security & Audit Logs</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* SECTION 1: DASHBOARD OVERVIEW */}
          {activeSection === 'dashboard' && stats && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Clinical Overview & Statistics
                </h2>
                <p className="text-xs text-slate-500">
                  Live operational snapshot for Aitemad Diagnostic Center Rawalpindi.
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Total Bookings</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-[#073B73] tabular-nums">{stats.total}</span>
                    <span className="text-xs text-slate-400 font-medium">All Time</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-xs text-amber-600 font-semibold uppercase">Pending Verification</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-amber-600 tabular-nums">{stats.pending}</span>
                    <span className="text-xs text-amber-500 font-medium">Needs Action</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-xs text-emerald-600 font-semibold uppercase">Confirmed Slots</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-emerald-600 tabular-nums">{stats.confirmed}</span>
                    <span className="text-xs text-emerald-500 font-medium">Scheduled</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-xs text-[#009C9A] font-semibold uppercase">Home Collections</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-[#009C9A] tabular-nums">{stats.homeCollections}</span>
                    <span className="text-xs text-slate-400 font-medium">Doorstep</span>
                  </div>
                </div>
              </div>

              {/* Secondary Stats Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="font-bold text-sm text-slate-800">Department Distribution</h3>
                  <div className="space-y-2 text-xs">
                    {Object.entries(stats.departmentCounts || {}).map(([dept, count]: any) => (
                      <div key={dept} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                        <span className="font-semibold text-slate-700">{dept}</span>
                        <span className="font-bold text-[#073B73] tabular-nums">{count} bookings</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800">Recent Appointments</h3>
                    <button
                      onClick={() => setActiveSection('appointments')}
                      className="text-xs text-[#009C9A] font-bold hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Ref</th>
                          <th className="p-2.5">Patient</th>
                          <th className="p-2.5">Department</th>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appointments.slice(0, 5).map((apt) => (
                          <tr key={apt.id} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-mono font-bold text-[#073B73]">{apt.bookingRef}</td>
                            <td className="p-2.5 font-medium text-slate-900">{apt.patientName}</td>
                            <td className="p-2.5 text-slate-600">{apt.department}</td>
                            <td className="p-2.5 tabular-nums text-slate-600">{apt.appointmentDate}</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                apt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                apt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {apt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: APPOINTMENTS MANAGER */}
          {activeSection === 'appointments' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Appointments Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Review incoming booking requests, confirm patient slots, and export records.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/api/appointments/export-csv"
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </a>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by name, ref or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-[#009C9A]"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs">
                  {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setAppointmentFilter(st)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        appointmentFilter.toLowerCase() === st.toLowerCase()
                          ? 'bg-[#073B73] text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Ref & Date</th>
                      <th className="p-3">Patient Details</th>
                      <th className="p-3">Department & Doctor</th>
                      <th className="p-3">Visit Type</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          No appointments match the criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <span className="font-mono font-bold text-[#073B73] block">{apt.bookingRef}</span>
                            <span className="text-[11px] text-slate-500 tabular-nums">
                              {apt.appointmentDate} at {apt.timeSlot}
                            </span>
                          </td>
                          <td className="p-3">
                            <strong className="block text-slate-900">{apt.patientName}</strong>
                            <span className="text-slate-500 tabular-nums">{apt.patientPhone}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800 block">{apt.department}</span>
                            <span className="text-slate-500 text-[11px]">{apt.doctorName || (apt.testNames ? apt.testNames.join(', ') : 'N/A')}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-slate-700">{apt.appointmentType}</span>
                            {apt.homeAddress && (
                              <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">{apt.homeAddress}</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              apt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                              apt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {apt.status === 'Pending' && (
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold cursor-pointer"
                                  title="Confirm Appointment"
                                >
                                  Confirm
                                </button>
                              )}
                              {apt.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-bold cursor-pointer"
                                  title="Mark as Completed"
                                >
                                  Complete
                                </button>
                              )}
                              {apt.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                                  className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-md text-[11px] font-semibold cursor-pointer"
                                  title="Cancel Appointment"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: PATIENTS REGISTRY */}
          {activeSection === 'patients' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Registered Patients Directory
                </h2>
                <p className="text-xs text-slate-500">
                  Patient database records linked by registered phone numbers.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Patient Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Gender & Age</th>
                      <th className="p-3">Registered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patients.map((pat) => (
                      <tr key={pat.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">{pat.name}</td>
                        <td className="p-3 tabular-nums text-slate-700">{pat.phone}</td>
                        <td className="p-3 text-slate-500">{pat.email || 'N/A'}</td>
                        <td className="p-3 text-slate-600">{pat.gender || 'N/A'} {pat.age ? `· ${pat.age} yrs` : ''}</td>
                        <td className="p-3 tabular-nums text-slate-500">{pat.registeredAt.split('T')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 4: LABORATORY TESTS MANAGER */}
          {activeSection === 'tests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Laboratory Tests Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add new laboratory tests, adjust prices, and update sample preparation instructions.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddTest(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#073B73] hover:bg-[#009C9A] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Test</span>
                </button>
              </div>

              {/* Add Test Modal */}
              {showAddTest && (
                <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-lg space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Add New Laboratory Test</h3>
                  <form onSubmit={handleCreateTest} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Test Name (English)</label>
                      <input
                        type="text"
                        required
                        value={newTest.name}
                        onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Test Name (Urdu)</label>
                      <input
                        type="text"
                        required
                        value={newTest.nameUrdu}
                        onChange={(e) => setNewTest({ ...newTest, nameUrdu: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Category</label>
                      <select
                        value={newTest.category}
                        onChange={(e) => setNewTest({ ...newTest, category: e.target.value as any })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      >
                        <option value="Routine Tests">Routine Tests</option>
                        <option value="Special Chemistry">Special Chemistry</option>
                        <option value="Serology">Serology</option>
                        <option value="Hematology">Hematology</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Original Price (Rs.)</label>
                      <input
                        type="number"
                        required
                        value={newTest.originalPrice}
                        onChange={(e) => setNewTest({ ...newTest, originalPrice: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Discounted Price (Rs.)</label>
                      <input
                        type="number"
                        required
                        value={newTest.discountedPrice}
                        onChange={(e) => setNewTest({ ...newTest, discountedPrice: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Turnaround Time</label>
                      <input
                        type="text"
                        value={newTest.deliveryTimeHours}
                        onChange={(e) => setNewTest({ ...newTest, deliveryTimeHours: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddTest(false)}
                        className="px-4 py-1.5 bg-slate-100 rounded-lg font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#009C9A] text-white rounded-lg font-bold cursor-pointer"
                      >
                        Save Test
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table of tests */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Test Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Regular Price</th>
                      <th className="p-3">Discounted (40%)</th>
                      <th className="p-3">Turnaround</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tests.map((tst) => (
                      <tr key={tst.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">
                          {tst.name}
                          <span className="text-[11px] text-slate-400 block font-normal">{tst.nameUrdu}</span>
                        </td>
                        <td className="p-3 font-semibold text-[#009C9A]">{tst.category}</td>
                        <td className="p-3 tabular-nums text-slate-400 line-through">Rs. {tst.originalPrice}</td>
                        <td className="p-3 tabular-nums font-bold text-[#073B73]">Rs. {tst.discountedPrice}</td>
                        <td className="p-3 tabular-nums text-slate-600">{tst.deliveryTimeHours}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteTest(tst.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete test"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 5: DIGITAL LAB REPORTS */}
          {activeSection === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Digital Laboratory Reports Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Generate diagnostic reports, verify values against clinical reference intervals, and release to patients.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddReport(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#073B73] hover:bg-[#009C9A] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Issue New Report</span>
                </button>
              </div>

              {/* Add Report Drawer */}
              {showAddReport && (
                <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-lg space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Issue Laboratory Report</h3>
                  <form onSubmit={handleCreateReport} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Patient Name</label>
                      <input
                        type="text"
                        required
                        value={newReport.patientName}
                        onChange={(e) => setNewReport({ ...newReport, patientName: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Patient Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="0300-1234567"
                        value={newReport.patientPhone}
                        onChange={(e) => setNewReport({ ...newReport, patientPhone: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Investigation Name</label>
                      <input
                        type="text"
                        required
                        value={newReport.testName}
                        onChange={(e) => setNewReport({ ...newReport, testName: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="font-semibold text-slate-600 block mb-1">Clinical Remarks</label>
                      <input
                        type="text"
                        value={newReport.doctorRemarks}
                        onChange={(e) => setNewReport({ ...newReport, doctorRemarks: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddReport(false)}
                        className="px-4 py-1.5 bg-slate-100 rounded-lg font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#009C9A] text-white rounded-lg font-bold cursor-pointer"
                      >
                        Release Report
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reports table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Report Number</th>
                      <th className="p-3">Patient</th>
                      <th className="p-3">Test</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Verified Pathologist</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-[#009C9A]">{rep.reportNumber}</td>
                        <td className="p-3">
                          <strong className="block text-slate-900">{rep.patientName}</strong>
                          <span className="text-slate-500 tabular-nums">{rep.patientPhone}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{rep.testName}</td>
                        <td className="p-3 tabular-nums text-slate-500">{rep.reportDate}</td>
                        <td className="p-3 text-slate-600">{rep.pathologistName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {rep.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 6: WEBSITE & CONTACT SETTINGS */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Website Content & Contact Information
                </h2>
                <p className="text-xs text-slate-500">
                  Update verified clinic telephone numbers, address, WhatsApp hotline, and bilingual copy in real time.
                </p>
              </div>

              {settingsSaved && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Website settings updated successfully! Live website reflects all changes.</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Clinic Name (English)</label>
                    <input
                      type="text"
                      value={editSettings.clinicName}
                      onChange={(e) => setEditSettings({ ...editSettings, clinicName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Clinic Name (Urdu)</label>
                    <input
                      type="text"
                      value={editSettings.clinicNameUrdu}
                      onChange={(e) => setEditSettings({ ...editSettings, clinicNameUrdu: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg font-urdu"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Primary Landline Phone</label>
                    <input
                      type="text"
                      value={editSettings.phonePrimary}
                      onChange={(e) => setEditSettings({ ...editSettings, phonePrimary: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Secondary Mobile Phone</label>
                    <input
                      type="text"
                      value={editSettings.phoneSecondary}
                      onChange={(e) => setEditSettings({ ...editSettings, phoneSecondary: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Official WhatsApp Number</label>
                    <input
                      type="text"
                      value={editSettings.whatsappNumber}
                      onChange={(e) => setEditSettings({ ...editSettings, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Physical Address (English)</label>
                  <input
                    type="text"
                    value={editSettings.address}
                    onChange={(e) => setEditSettings({ ...editSettings, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Physical Address (Urdu)</label>
                  <input
                    type="text"
                    value={editSettings.addressUrdu}
                    onChange={(e) => setEditSettings({ ...editSettings, addressUrdu: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg font-urdu"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Weekday Hours</label>
                    <input
                      type="text"
                      value={editSettings.hoursWeekdays}
                      onChange={(e) => setEditSettings({ ...editSettings, hoursWeekdays: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sunday Hours</label>
                    <input
                      type="text"
                      value={editSettings.hoursSunday}
                      onChange={(e) => setEditSettings({ ...editSettings, hoursSunday: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#073B73] hover:bg-[#009C9A] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 7: BACKUP & RESTORE */}
          {activeSection === 'backup' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Database Backup & Restoration
                </h2>
                <p className="text-xs text-slate-500">
                  Download full database snapshot in JSON format or restore from an archive.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Download Backup Archive</h3>
                  <p className="text-xs text-slate-600">
                    Exports all appointments, patient profiles, laboratory test catalogs, settings, and audit logs.
                  </p>
                  <a
                    href="/api/admin/backup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#073B73] hover:bg-[#052d59] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </a>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">Restore from JSON Archive</h3>
                  <textarea
                    rows={3}
                    placeholder="Paste backup JSON string here..."
                    value={restoreText}
                    onChange={(e) => setRestoreText(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded-lg text-xs font-mono"
                  />
                  {restoreMsg && (
                    <p className="text-xs font-semibold text-[#009C9A]">{restoreMsg}</p>
                  )}
                  <button
                    onClick={handleRestore}
                    className="px-5 py-2 bg-[#009C9A] hover:bg-[#008381] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Restore Database
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: AUDIT LOGS */}
          {activeSection === 'audit' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Security & Audit Trail
                </h2>
                <p className="text-xs text-slate-500">
                  Immutable chronological log of all administrative actions and booking transactions.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">Actor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3 tabular-nums text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-3 font-bold text-slate-900">{log.action}</td>
                        <td className="p-3 text-slate-600">{log.details}</td>
                        <td className="p-3 font-semibold text-[#009C9A]">{log.performedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
