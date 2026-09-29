export type Language = 'en' | 'ur';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';
export type AppointmentType = 'Clinic Visit' | 'Home Sample Collection';

export interface WebsiteSettings {
  clinicName: string;
  clinicNameUrdu: string;
  tagline: string;
  taglineUrdu: string;
  slogan: string;
  sloganUrdu: string;
  description: string;
  descriptionUrdu: string;
  address: string;
  addressUrdu: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  whatsappNumberAlt: string;
  email: string;
  websiteUrl: string;
  hoursWeekdays: string;
  hoursSunday: string;
  emergencyService: string;
  emergencyServiceUrdu: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  discountPercentage: number;
}

export interface Department {
  id: string;
  name: string;
  nameUrdu: string;
  slug: string;
  description: string;
  descriptionUrdu: string;
  icon: string;
  features: string[];
  featuresUrdu: string[];
  timing: string;
  isAvailable: boolean;
  image?: string;
}

export interface Doctor {
  id: string;
  name: string;
  nameUrdu: string;
  title: string;
  titleUrdu: string;
  department: string;
  departmentUrdu: string;
  specialization: string;
  specializationUrdu: string;
  qualifications: string;
  qualificationsUrdu: string;
  experienceYears: number;
  consultationDays: string[];
  consultationDaysUrdu: string;
  consultationHours: string;
  fee: number;
  availableSlots: string[];
  bio: string;
  bioUrdu: string;
  isAvailable: boolean;
  image?: string;
}

export interface LaboratoryTest {
  id: string;
  name: string;
  nameUrdu: string;
  category: 'Routine Tests' | 'Special Chemistry' | 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Serology' | 'Urine Testing' | 'Other';
  description: string;
  descriptionUrdu: string;
  originalPrice: number;
  discountedPrice: number;
  sampleType: string;
  preparationInstructions: string;
  preparationInstructionsUrdu: string;
  deliveryTimeHours: string;
  popular: boolean;
  isActive: boolean;
}

export interface TestPackage {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  testCount: number;
  testNames: string[];
  originalPrice: number;
  discountedPrice: number;
  discountBadge: string;
  popular: boolean;
  validUntil: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  bookingRef: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  gender: 'Male' | 'Female' | 'Other';
  age?: number;
  department: string;
  doctorId?: string;
  doctorName?: string;
  testIds?: string[];
  testNames?: string[];
  appointmentDate: string;
  timeSlot: string;
  appointmentType: AppointmentType;
  homeAddress?: string;
  notes?: string;
  status: AppointmentStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gender?: string;
  age?: number;
  address?: string;
  registeredAt: string;
}

export interface TestResultItem {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: 'Normal' | 'High' | 'Low';
}

export interface LaboratoryReport {
  id: string;
  reportNumber: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  appointmentRef?: string;
  testCategory: string;
  testName: string;
  sampleCollectedAt: string;
  reportDate: string;
  pathologistName: string;
  status: 'Ready' | 'In Progress' | 'Archived';
  results: TestResultItem[];
  doctorRemarks: string;
  downloadUrl?: string;
}

export interface GalleryMediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  titleUrdu: string;
  category: 'Exterior' | 'Reception' | 'Laboratory' | 'OPD' | 'Pharmacy' | 'Opening' | 'Equipment';
  url: string;
  thumbnailUrl?: string;
  caption: string;
  captionUrdu: string;
  featured: boolean;
  date?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
  ip?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Read' | 'Replied';
}
