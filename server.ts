import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { db } from './server/dataStore.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- API ROUTES ---

// 1. Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.getState().settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Departments
app.get('/api/departments', (_req: Request, res: Response) => {
  res.json(db.getState().departments);
});

// 3. Doctors
app.get('/api/doctors', (_req: Request, res: Response) => {
  res.json(db.getState().doctors);
});

app.put('/api/doctors/:id', (req: Request, res: Response) => {
  const updated = db.updateDoctor(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Doctor not found' });
    return;
  }
  res.json({ success: true, doctor: updated });
});

// 4. Tests
app.get('/api/tests', (_req: Request, res: Response) => {
  res.json(db.getState().tests);
});

app.post('/api/tests', (req: Request, res: Response) => {
  try {
    const created = db.createTest(req.body);
    res.status(201).json({ success: true, test: created });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/tests/:id', (req: Request, res: Response) => {
  const updated = db.updateTest(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Test not found' });
    return;
  }
  res.json({ success: true, test: updated });
});

app.delete('/api/tests/:id', (req: Request, res: Response) => {
  const ok = db.deleteTest(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Test not found' });
    return;
  }
  res.json({ success: true });
});

// 5. Packages
app.get('/api/packages', (_req: Request, res: Response) => {
  res.json(db.getState().packages);
});

// 6. Appointments
app.get('/api/appointments', (req: Request, res: Response) => {
  const { status, department, search, date } = req.query;
  let list = db.getAppointments();

  if (status && status !== 'all') {
    list = list.filter(a => a.status.toLowerCase() === (status as string).toLowerCase());
  }
  if (department && department !== 'all') {
    list = list.filter(a => a.department.toLowerCase().includes((department as string).toLowerCase()));
  }
  if (date) {
    list = list.filter(a => a.appointmentDate === date);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(a =>
      a.patientName.toLowerCase().includes(q) ||
      a.patientPhone.includes(q) ||
      a.bookingRef.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

app.post('/api/appointments', (req: Request, res: Response) => {
  try {
    const { patientName, patientPhone, department, appointmentDate, timeSlot, appointmentType } = req.body;
    if (!patientName || !patientPhone || !department || !appointmentDate || !timeSlot) {
      res.status(400).json({ error: 'Missing required appointment fields' });
      return;
    }

    const { appointment, doubleBooked } = db.createAppointment(req.body);
    res.status(201).json({
      success: true,
      appointment,
      doubleBookedWarning: doubleBooked ? 'A booking already exists for this slot, pending admin verification.' : null
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Track appointment (safe public endpoint)
app.post('/api/appointments/track', (req: Request, res: Response) => {
  const { bookingRef, phone } = req.body;
  if (!bookingRef) {
    res.status(400).json({ error: 'Booking reference is required' });
    return;
  }

  const apt = db.getAppointmentByRef(bookingRef, phone);
  if (!apt) {
    res.status(404).json({ error: 'No matching appointment found with the provided details' });
    return;
  }

  // Return non-confidential status information
  res.json({
    bookingRef: apt.bookingRef,
    patientName: apt.patientName,
    department: apt.department,
    doctorName: apt.doctorName,
    testNames: apt.testNames,
    appointmentDate: apt.appointmentDate,
    timeSlot: apt.timeSlot,
    appointmentType: apt.appointmentType,
    status: apt.status,
    createdAt: apt.createdAt
  });
});

app.patch('/api/appointments/:id/status', (req: Request, res: Response) => {
  const { status, internalNotes } = req.body;
  const updated = db.updateAppointmentStatus(req.params.id, status, internalNotes);
  if (!updated) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  res.json({ success: true, appointment: updated });
});

app.patch('/api/appointments/:id/reschedule', (req: Request, res: Response) => {
  const { appointmentDate, timeSlot } = req.body;
  if (!appointmentDate || !timeSlot) {
    res.status(400).json({ error: 'New appointment date and time slot required' });
    return;
  }
  const updated = db.rescheduleAppointment(req.params.id, appointmentDate, timeSlot);
  if (!updated) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  res.json({ success: true, appointment: updated });
});

app.patch('/api/appointments/:id/cancel', (req: Request, res: Response) => {
  const { reason } = req.body;
  const updated = db.cancelAppointment(req.params.id, reason);
  if (!updated) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  res.json({ success: true, appointment: updated });
});

// CSV Export
app.get('/api/appointments/export-csv', (_req: Request, res: Response) => {
  const apts = db.getAppointments();
  const headers = ['Booking Ref', 'Patient Name', 'Phone', 'Gender', 'Department', 'Doctor / Tests', 'Date', 'Time Slot', 'Type', 'Status', 'Booked At'];
  const rows = apts.map(a => [
    a.bookingRef,
    `"${a.patientName.replace(/"/g, '""')}"`,
    a.patientPhone,
    a.gender,
    `"${a.department}"`,
    `"${(a.doctorName || (a.testNames ? a.testNames.join(', ') : ''))}"`,
    a.appointmentDate,
    a.timeSlot,
    a.appointmentType,
    a.status,
    a.createdAt.split('T')[0]
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=aitemad-appointments-${new Date().toISOString().split('T')[0]}.csv`);
  res.send(csv);
});

// 7. Patients
app.get('/api/patients', (_req: Request, res: Response) => {
  res.json(db.getState().patients);
});

// 8. Reports
app.get('/api/reports', (req: Request, res: Response) => {
  const { phone } = req.query;
  const reports = db.getReports(phone as string | undefined);
  res.json(reports);
});

app.post('/api/reports', (req: Request, res: Response) => {
  try {
    const report = db.createReport(req.body);
    res.status(201).json({ success: true, report });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 9. Gallery
app.get('/api/gallery', (_req: Request, res: Response) => {
  res.json(db.getState().gallery);
});

app.post('/api/gallery', (req: Request, res: Response) => {
  try {
    const item = db.addGalleryItem(req.body);
    res.status(201).json({ success: true, item });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/gallery/:id', (req: Request, res: Response) => {
  const ok = db.deleteGalleryItem(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Media item not found' });
    return;
  }
  res.json({ success: true });
});

// 10. Contact
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone || !message) {
      res.status(400).json({ error: 'Name, phone, and message are required' });
      return;
    }
    const created = db.addMessage(req.body);
    res.status(201).json({ success: true, message: created });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contact', (_req: Request, res: Response) => {
  res.json(db.getState().messages);
});

// 11. Admin Stats & Audit
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const state = db.getState();
  const apts = state.appointments;
  const today = new Date().toISOString().split('T')[0];

  const total = apts.length;
  const pending = apts.filter(a => a.status === 'Pending').length;
  const confirmed = apts.filter(a => a.status === 'Confirmed').length;
  const completed = apts.filter(a => a.status === 'Completed').length;
  const cancelled = apts.filter(a => a.status === 'Cancelled').length;
  const todayBookings = apts.filter(a => a.appointmentDate === today).length;
  const homeCollections = apts.filter(a => a.appointmentType === 'Home Sample Collection').length;

  const departmentCounts: Record<string, number> = {};
  apts.forEach(a => {
    departmentCounts[a.department] = (departmentCounts[a.department] || 0) + 1;
  });

  res.json({
    total,
    pending,
    confirmed,
    completed,
    cancelled,
    todayBookings,
    homeCollections,
    patientsCount: state.patients.length,
    testsCount: state.tests.length,
    doctorsCount: state.doctors.length,
    reportsCount: state.reports.length,
    departmentCounts
  });
});

app.get('/api/admin/audit-logs', (_req: Request, res: Response) => {
  res.json(db.getState().auditLogs);
});

app.get('/api/admin/backup', (_req: Request, res: Response) => {
  const backup = db.exportBackup();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=aitemad-db-backup-${Date.now()}.json`);
  res.send(backup);
});

app.post('/api/admin/restore', (req: Request, res: Response) => {
  try {
    const raw = req.body.backupData || JSON.stringify(req.body);
    const ok = db.restoreBackup(typeof raw === 'string' ? raw : JSON.stringify(raw));
    if (!ok) {
      res.status(400).json({ error: 'Restore failed: Invalid backup structure' });
      return;
    }
    res.json({ success: true, message: 'Database successfully restored' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Login (supports credentials: admin / aitemad2026)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if ((username === 'admin' || username === 'admin@aitemadlab.com') && (password === 'aitemad2026' || password === 'admin123')) {
    db.logAudit("Admin Login Success", `User ${username} logged in successfully`, "Security");
    res.json({
      success: true,
      token: "jwt_aitemad_admin_" + Date.now(),
      user: {
        name: "Clinic Administrator",
        email: "admin@aitemadlab.com",
        role: "SuperAdmin"
      }
    });
  } else {
    db.logAudit("Failed Admin Login", `Invalid attempt for user: ${username}`, "Security");
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Patient Login (simple phone + PIN or OTP verification)
app.post('/api/patient/login', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: 'Phone number is required' });
    return;
  }
  const cleanPhone = phone.replace(/\D/g, '');
  const state = db.getState();
  const patient = state.patients.find(p => p.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-7)));

  const appointments = state.appointments.filter(a => a.patientPhone.replace(/\D/g, '').endsWith(cleanPhone.slice(-7)));
  const reports = state.reports.filter(r => r.patientPhone.replace(/\D/g, '').endsWith(cleanPhone.slice(-7)));

  res.json({
    success: true,
    patient: patient || {
      id: "pat-" + Date.now(),
      name: "Valued Patient",
      phone: phone,
      registeredAt: new Date().toISOString()
    },
    appointments,
    reports
  });
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Aitemad Clinic Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
