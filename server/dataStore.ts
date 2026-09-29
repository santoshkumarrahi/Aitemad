import fs from 'fs';
import path from 'path';
import {
  WebsiteSettings,
  Department,
  Doctor,
  LaboratoryTest,
  TestPackage,
  Appointment,
  Patient,
  LaboratoryReport,
  GalleryMediaItem,
  AuditLogItem,
  ContactMessage,
} from '../src/types/index.ts';

const DB_FILE = path.resolve(process.cwd(), 'clinic-db.json');

export interface DatabaseState {
  settings: WebsiteSettings;
  departments: Department[];
  doctors: Doctor[];
  tests: LaboratoryTest[];
  packages: TestPackage[];
  appointments: Appointment[];
  patients: Patient[];
  reports: LaboratoryReport[];
  gallery: GalleryMediaItem[];
  messages: ContactMessage[];
  auditLogs: AuditLogItem[];
}

const initialSettings: WebsiteSettings = {
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

const initialDepartments: Department[] = [
  {
    id: "dep-opd",
    name: "OPD — Outpatient Department",
    nameUrdu: "او پی ڈی — آؤٹ پیشنٹ ڈیپارٹمنٹ",
    slug: "opd",
    description: "Convenient outpatient consultation services for patients seeking expert medical advice, diagnostic examination, and tailored treatment plans.",
    descriptionUrdu: "طبی مشورے، تشخیصی معائنے اور علاج کی منصوبہ بندی کے لیے مریضوں کی سہولت پر مبنی او پی ڈی سروسز۔",
    icon: "Stethoscope",
    features: [
      "Senior Doctor Consultation",
      "Digital Patient Registration",
      "Walk-in & Advance Appointments",
      "Flexible Morning & Evening OPD Hours",
      "Patient Friendly Environment"
    ],
    featuresUrdu: [
      "سینئر ڈاکٹر سے مشاورت",
      "ڈیجیٹل مریض رجسٹریشن",
      "واک ان اور پیشگی اپائنٹمنٹ",
      "صبح اور شام کے مشاورتی اوقات",
      "مریض دوست ماحول"
    ],
    timing: "Mon - Sat: 9:00 AM - 9:00 PM",
    isAvailable: true,
    image: "/src/assets/images/doctor_consultation_opd_1790651637185.jpg"
  },
  {
    id: "dep-lab",
    name: "Clinical Laboratory",
    nameUrdu: "کلینیکل لیبارٹری",
    slug: "laboratory",
    description: "State-of-the-art diagnostic testing with automated analyzers (DH-26 3/5-part hematology), precise biochemistry, and certified laboratory technologists.",
    descriptionUrdu: "جدید آٹومیٹڈ اینالائزرز کے ذریعے فوری اور انتہائی درست تشخیصی نتائج اور مستند پیتھالوجسٹ کی نگرانی۔",
    icon: "FlaskConical",
    features: [
      "Routine Hematology (CBC & ESR)",
      "Special Chemistry & Hormonal Assays",
      "Same-Day Digital Test Reports",
      "Home Sample Collection Available",
      "Barcoded Sample Tracking"
    ],
    featuresUrdu: [
      "روٹین ہیماٹولوجی (سی بی سی اور ای ایس آر)",
      "سپیشل کیمسٹری اور ہارمونل ٹیسٹ",
      "اسی دن ڈیجیٹل ٹیسٹ رپورٹ",
      "گھر سے نمونہ حاصل کرنے کی سہولت",
      "بارکوڈڈ محفوظ ٹریکنگ"
    ],
    timing: "24/7 Laboratory Service",
    isAvailable: true,
    image: "/src/assets/images/lab_analyzer_equipment_1790651617627.jpg"
  },
  {
    id: "dep-pharmacy",
    name: "Pharmacy",
    nameUrdu: "فارمیسی سروسز",
    slug: "pharmacy",
    description: "Fully stocked retail & clinical pharmacy dispensing authentic, temperature-controlled medicines, surgical disposables, and wellness essentials.",
    descriptionUrdu: "مستند ادویات، سرجیکل سامان اور صحت کی بنیادی ضروریات کی بروقت فراہمی کے لیے فعال فارمیسی۔",
    icon: "Pill",
    features: [
      "100% Genuine Certified Medicines",
      "Qualified Pharmacist Assistance",
      "Emergency Prescription Fulfillment",
      "Patient Medication Counseling",
      "Home Medicine Delivery Inquiries"
    ],
    featuresUrdu: [
      "100٪ مستند اور معیاری ادویات",
      "کوالیفائیڈ فارماسسٹ کی رہنمائی",
      "ایمرجنسی نسخہ جات کی دستیابی",
      "ادویات کے درست استعمال پر رہنمائی",
      "گھر پر ادویات منگوانے کی سہولت"
    ],
    timing: "Mon - Sun: 8:00 AM - 11:00 PM",
    isAvailable: true,
    image: "/src/assets/images/pharmacy_counter_medicines_1790651651380.jpg"
  },
  {
    id: "dep-specialist",
    name: "Medical Specialist",
    nameUrdu: "میڈیکل سپیشلسٹ",
    slug: "medical-specialist",
    description: "Consultation with experienced consultant physicians for diabetes, hypertension, cardiovascular, gastrointestinal, and complex systemic disorders.",
    descriptionUrdu: "ذیابیطس، بلڈ پریشر، معدہ، جگر اور دیگر پیچیدہ بیماریوں کے لیے ماہر کنسلٹنٹ فزیشن سے تفصیلی معائنہ۔",
    icon: "UserCheck",
    features: [
      "Consultant Physician Evaluation",
      "Chronic Disease Management",
      "Comprehensive Diabetic Care",
      "Cardiovascular Risk Assessment",
      "Follow-up Health Monitoring"
    ],
    featuresUrdu: [
      "کنسلٹنٹ فزیشن کی زیر نگرانی معائنہ",
      "دائمی بیماریوں کا جدید علاج",
      "شوگر اور بلڈ پریشر کی کونسلنگ",
      "دل اور خون کی شریانوں کا جائزہ",
      "باقاعدہ فالو اپ اور مانیٹرنگ"
    ],
    timing: "Mon, Wed, Fri: 4:00 PM - 8:00 PM",
    isAvailable: true,
    image: "/src/assets/images/doctor_consultation_opd_1790651637185.jpg"
  },
  {
    id: "dep-gynae",
    name: "Gynecologist & Obstetrician",
    nameUrdu: "گائناکالوجسٹ اور ماہر امراض نسواں",
    slug: "gynecologist",
    description: "Compassionate, confidential women's healthcare, antenatal checkups, maternal wellness, infertility consultation, and ultrasound guidance.",
    descriptionUrdu: "خواتین کی صحت، زچگی کی دیکھ بھال، قبل از ولادت معائنہ اور بانجھ پن کے علاج کے لیے قابل اعتماد خواتین ڈاکٹرز۔",
    icon: "HeartPulse",
    features: [
      "Experienced Female Gynecologist",
      "Antenatal & Postnatal Mother Care",
      "Infertility & Hormonal Diagnostics",
      "Confidential & Comfortable Suite",
      "Preventive Gynecological Screenings"
    ],
    featuresUrdu: [
      "تجربہ کار لیڈی گائناکالوجسٹ",
      "دوران حمل اور بعد از پیدائش نگہداشت",
      "ہارمونل مسائل اور بانجھ پن کی تشخیص",
      "مکمل رازداری اور آرام دہ ماحول",
      "خواتین کے لیے خصوصی سکریننگ"
    ],
    timing: "Tue, Thu, Sat: 3:00 PM - 7:00 PM",
    isAvailable: true,
    image: "/src/assets/images/hero_clinic_diagnostic_1790651599920.jpg"
  }
];

const initialDoctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Muhammad Tahir",
    nameUrdu: "ڈاکٹر محمد طاہر",
    title: "Consultant Medical Specialist",
    titleUrdu: "کنسلٹنٹ میڈیکل سپیشلسٹ",
    department: "Medical Specialist",
    departmentUrdu: "میڈیکل سپیشلسٹ",
    specialization: "Internal Medicine & Chronic Disease Care",
    specializationUrdu: "انٹرنل میڈیسن اور دائمی امراض کے ماہر",
    qualifications: "MBBS, FCPS (Medicine)",
    qualificationsUrdu: "ایم بی بی ایس، ایف سی پی ایس (میڈیسن)",
    experienceYears: 12,
    consultationDays: ["Mon", "Wed", "Fri"],
    consultationDaysUrdu: "پیر، بدھ، جمعہ",
    consultationHours: "4:00 PM - 8:00 PM",
    fee: 1500,
    availableSlots: ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"],
    bio: "Senior consultant with extensive hospital practice in managing diabetes mellitus, uncontrolled hypertension, respiratory ailments, and liver disorders.",
    bioUrdu: "ذیابیطس، بلڈ پریشر، سانس کی بیماریوں اور جگر کے امراض کے علاج میں وسیع ہسپتال کا تجربہ رکھنے والے سینئر کنسلٹنٹ۔",
    isAvailable: true
  },
  {
    id: "doc-2",
    name: "Dr. Ayesha Noor",
    nameUrdu: "ڈاکٹر عائشہ نور",
    title: "Consultant Gynecologist & Obstetrician",
    titleUrdu: "کنسلٹنٹ گائناکالوجسٹ اور ماہر امراض نسواں",
    department: "Gynecologist",
    departmentUrdu: "گائناکالوجسٹ",
    specialization: "Women's Health, Antenatal Care & Infertility",
    specializationUrdu: "صحت نسواں، زچگی و پیدائش اور بانجھ پن",
    qualifications: "MBBS, MCPS, FCPS (Gynae/Obs)",
    qualificationsUrdu: "ایم بی بی ایس، ایم سی پی ایس، ایف سی پی ایس",
    experienceYears: 10,
    consultationDays: ["Tue", "Thu", "Sat"],
    consultationDaysUrdu: "منگل، جمعرات، ہفتہ",
    consultationHours: "3:00 PM - 7:00 PM",
    fee: 1500,
    availableSlots: ["03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"],
    bio: "Dedicated women's specialist providing comprehensive maternal care, reproductive wellness guidance, and compassionate gynecological examinations.",
    bioUrdu: "ماں اور بچے کی صحت، قبل از پیدائش نگہداشت اور نسوانی مسائل کے علاج کے لیے وقف ماہر ڈاکٹر۔",
    isAvailable: true
  },
  {
    id: "doc-3",
    name: "Dr. Hamza Bangash",
    nameUrdu: "ڈاکٹر حمزہ بنگش",
    title: "OPD General Physician & Medical Officer",
    titleUrdu: "او پی ڈی جنرل فزیشن اور میڈیکل آفیسر",
    department: "OPD",
    departmentUrdu: "او پی ڈی",
    specialization: "Primary Care, Family Health & Preventative Medicine",
    specializationUrdu: "پرائمری ہیلتھ کیئر اور خاندانی معالجہ",
    qualifications: "MBBS, PMDC Verified",
    qualificationsUrdu: "ایم بی بی ایس، پی ایم ڈی سی رجسٹرڈ",
    experienceYears: 7,
    consultationDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    consultationDaysUrdu: "پیر تا ہفتہ",
    consultationHours: "9:00 AM - 3:00 PM",
    fee: 800,
    availableSlots: ["09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "02:00 PM", "02:30 PM"],
    bio: "Attending general practitioner providing accurate diagnostic evaluations, emergency first aid triage, and compassionate medical care for all age groups.",
    bioUrdu: "ہر عمر کے مریضوں کے لیے ابتدائی معائنے، فوری تشخیص اور ادویات کی درست رہنمائی فراہم کرنے والے جنرل فزیشن۔",
    isAvailable: true
  },
  {
    id: "doc-4",
    name: "Dr. Sajid Mehmood",
    nameUrdu: "ڈاکٹر ساجد محمود",
    title: "Head Pathologist & Laboratory Director",
    titleUrdu: "سربراہ پیتھالوجسٹ اور لیبارٹری ڈائریکٹر",
    department: "Laboratory",
    departmentUrdu: "کلینیکل لیبارٹری",
    specialization: "Clinical Pathology & Diagnostic Hematology",
    specializationUrdu: "کلینیکل پیتھالوجی اور ڈائیگنوسٹک ہیماٹولوجی",
    qualifications: "M.Phil Haematology, MBBS, DCP",
    qualificationsUrdu: "ایم فل ہیماٹولوجی، ایم بی بی ایس، ڈی سی پی",
    experienceYears: 15,
    consultationDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    consultationDaysUrdu: "پیر تا ہفتہ",
    consultationHours: "10:00 AM - 6:00 PM",
    fee: 1000,
    availableSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"],
    bio: "Supervising laboratory quality control, automated hematology calibration, abnormal blood morphology, and clinical correlation of test results.",
    bioUrdu: "لیبارٹری کے کوالٹی کنٹرول، جدید اینالائزرز اور پیچیدہ خون کے ٹیسٹوں کی تشخیصی تصدیق کے نگراں۔",
    isAvailable: true
  }
];

const initialTests: LaboratoryTest[] = [
  {
    id: "test-cbc",
    name: "CBC (Complete Blood Count) with ESR",
    nameUrdu: "سی بی سی (خون کا مکمل تجزیہ) بمع ای ایس آر",
    category: "Routine Tests",
    description: "Evaluates red blood cells, hemoglobin, white blood cells, platelets, and systemic inflammatory markers.",
    descriptionUrdu: "خون کے سرخ و سفید خلیات، ہیموگلوبن اور پلیٹ لیٹس کا جامع معائنہ۔",
    originalPrice: 1000,
    discountedPrice: 600,
    sampleType: "Blood (EDTA Tube)",
    preparationInstructions: "No fasting required. Avoid strenuous exercise immediately before sample collection.",
    preparationInstructionsUrdu: "کسی خاص پرہیز کی ضرورت نہیں ہے۔ ٹیسٹ سے قبل شدید ورزش سے گریز کریں۔",
    deliveryTimeHours: "2 to 4 Hours",
    popular: true,
    isActive: true
  },
  {
    id: "test-bs",
    name: "Blood Sugar (Fasting / Random)",
    nameUrdu: "بلڈ شوگر (فاسٹنگ یا رینڈم)",
    category: "Routine Tests",
    description: "Measures circulating glucose levels for screening and monitoring of diabetes mellitus.",
    descriptionUrdu: "خون میں گلوکوز کی سطح کا تعین برائے شوگر کی تشخیص و مانیٹرنگ۔",
    originalPrice: 400,
    discountedPrice: 240,
    sampleType: "Fluoride Plasma / Serum",
    preparationInstructions: "Fasting test requires 8-10 hours overnight fasting (water is allowed).",
    preparationInstructionsUrdu: "فاسٹنگ ٹیسٹ کے لیے 8 سے 10 گھنٹے بھوکا رہنا ضروری ہے (پانی پیا جا سکتا ہے)۔",
    deliveryTimeHours: "1 to 2 Hours",
    popular: true,
    isActive: true
  },
  {
    id: "test-lipid",
    name: "Lipid Profile Complete",
    nameUrdu: "لپڈ پروفائل (کولیسٹرول اور چکنائیاں)",
    category: "Routine Tests",
    description: "Comprehensive panel assessing Total Cholesterol, Triglycerides, HDL, LDL, and VLDL for cardiovascular risk evaluation.",
    descriptionUrdu: "کولیسٹرول، ٹرائیگلیسرائڈز، اچھے اور برے کولیسٹرول کی مکمل جانچ۔",
    originalPrice: 2600,
    discountedPrice: 1560,
    sampleType: "Serum",
    preparationInstructions: "Strict 10-12 hours fasting required. Drink plenty of plain water.",
    preparationInstructionsUrdu: "ٹیسٹ سے 10 سے 12 گھنٹے پہلے تک کچھ نہ کھائیں، صرف سادہ پانی پئیں۔",
    deliveryTimeHours: "4 to 6 Hours",
    popular: true,
    isActive: true
  },
  {
    id: "test-lft",
    name: "LFT (Liver Function Test)",
    nameUrdu: "ایل ایف ٹی (جگر کے افعال کا ٹیسٹ)",
    category: "Routine Tests",
    description: "Evaluates liver enzymes (ALT/SGPT, AST/SGOT, Alkaline Phosphatase), Total Bilirubin, and Serum Proteins.",
    descriptionUrdu: "جگر کے انزائمز، یرقان (بلیروبن) اور پروٹینز کی جانچ۔",
    originalPrice: 2500,
    discountedPrice: 1500,
    sampleType: "Serum",
    preparationInstructions: "Overnight fasting recommended for 6-8 hours for optimal enzyme baseline.",
    preparationInstructionsUrdu: "بہترین نتائج کے لیے 6 سے 8 گھنٹے کا فاقہ تجویز کیا جاتا ہے۔",
    deliveryTimeHours: "4 to 6 Hours",
    popular: true,
    isActive: true
  },
  {
    id: "test-rft",
    name: "RFT (Renal Function Test / KFT)",
    nameUrdu: "آر ایف ٹی (گردوں کے افعال کا ٹیسٹ)",
    category: "Routine Tests",
    description: "Assesses kidney filtration capacity via Serum Creatinine, Blood Urea, and Uric Acid levels.",
    descriptionUrdu: "سیرم کریٹنائن، یوریا اور یورک ایسڈ کے ذریعے گردوں کی کارکردگی کا جائزہ۔",
    originalPrice: 2000,
    discountedPrice: 1200,
    sampleType: "Serum",
    preparationInstructions: "Maintain normal hydration; avoid high-protein feast the night prior.",
    preparationInstructionsUrdu: "معمول کے مطابق پانی پئیں اور ایک رات پہلے زیادہ گوشت کھانے سے گریز کریں۔",
    deliveryTimeHours: "3 to 5 Hours",
    popular: true,
    isActive: true
  },
  {
    id: "test-urine",
    name: "Urine Routine Examination (R/E)",
    nameUrdu: "پیشاب کا تفصیلی معائنہ (یورین آر ای)",
    category: "Routine Tests",
    description: "Microscopic and chemical testing for urinary tract infection, protein, glucose, pus cells, and crystals.",
    descriptionUrdu: "پیشاب میں انفیکشن، پیپ، پروٹین اور پتھری کے اجزاء کی لیبارٹری جانچ۔",
    originalPrice: 650,
    discountedPrice: 390,
    sampleType: "Clean Catch Midstream Urine",
    preparationInstructions: "Collect first morning midstream urine specimen in a sterile container provided by lab.",
    preparationInstructionsUrdu: "صبح کا پہلا درمیانی پیشاب لیب سے دیے گئے جراثیم سے پاک ڈبے میں جمع کریں۔",
    deliveryTimeHours: "2 to 3 Hours",
    popular: false,
    isActive: true
  },
  {
    id: "test-tsh",
    name: "Thyroid Profile (TSH, Free T3, Free T4)",
    nameUrdu: "تھائیرائیڈ پروفائل (ٹی ایس ایچ، ٹی 3، ٹی 4)",
    category: "Special Chemistry",
    description: "Evaluates thyroid gland activity to diagnose hypothyroidism, hyperthyroidism, and metabolic sluggishness.",
    descriptionUrdu: "تھائیرائیڈ غدود کی کارکردگی کا معائنہ، وزن اور ہارمونز کے عدم توازن کے لیے۔",
    originalPrice: 4000,
    discountedPrice: 2400,
    sampleType: "Serum",
    preparationInstructions: "Morning sample preferred; consult doctor if taking thyroid medication.",
    preparationInstructionsUrdu: "صبح کے وقت نمونہ دینا بہتر ہے، تھائیرائیڈ کی دوا لیب عملے کو بتائیں۔",
    deliveryTimeHours: "Same Day (6 Hours)",
    popular: true,
    isActive: true
  },
  {
    id: "test-hba1c",
    name: "HbA1c (Glycated Hemoglobin)",
    nameUrdu: "ایچ بی اے ون سی (3 ماہ کی اوسط شوگر)",
    category: "Special Chemistry",
    description: "Reflects average blood sugar control over the past 90 days. Gold standard for diabetic therapy tracking.",
    descriptionUrdu: "گزشتہ تین ماہ کے دوران خون میں شوگر کے اوسط کنٹرول کی مستند جانچ۔",
    originalPrice: 1800,
    discountedPrice: 1080,
    sampleType: "Blood (EDTA)",
    preparationInstructions: "No fasting required. Can be drawn at any hour of the day.",
    preparationInstructionsUrdu: "بھوکا رہنے کی ضرورت نہیں، دن کے کسی بھی وقت ٹیسٹ کروایا جا سکتا ہے۔",
    deliveryTimeHours: "3 to 4 Hours",
    popular: true,
    isActive: true
  },
  {
    id: "test-vitd",
    name: "Vitamin D (25-Hydroxy)",
    nameUrdu: "وٹامن ڈی (ہڈیوں کی مضبوطی کا ٹیسٹ)",
    category: "Special Chemistry",
    description: "Measures circulating vitamin D levels essential for bone density, joint wellness, and immune defense.",
    descriptionUrdu: "ہڈیوں کی طاقت، جوڑوں کے درد اور قوت مدافعت کے لیے وٹامن ڈی کی پیمائش۔",
    originalPrice: 4500,
    discountedPrice: 2700,
    sampleType: "Serum",
    preparationInstructions: "No special dietary restrictions necessary.",
    preparationInstructionsUrdu: "کسی خاص پرہیز کی ضرورت نہیں ہے۔",
    deliveryTimeHours: "24 Hours",
    popular: true,
    isActive: true
  },
  {
    id: "test-vitb12",
    name: "Vitamin B12 (Cyanocobalamin)",
    nameUrdu: "وٹامن بی 12 (اعصابی کمزوری کا ٹیسٹ)",
    category: "Special Chemistry",
    description: "Assesses nerve cell health, neurological signaling, and red cell formation capacity.",
    descriptionUrdu: "پٹھوں کی کمزوری، اعصابی نظام اور خون بنانے کے لیے وٹامن بی 12 کا ٹیسٹ۔",
    originalPrice: 4200,
    discountedPrice: 2520,
    sampleType: "Serum",
    preparationInstructions: "Overnight fasting 6-8 hours recommended.",
    preparationInstructionsUrdu: "6 سے 8 گھنٹے کا فاقہ تجویز کیا جاتا ہے۔",
    deliveryTimeHours: "24 Hours",
    popular: false,
    isActive: true
  },
  {
    id: "test-hormones",
    name: "Hormonal Assays (FSH, LH, Prolactin)",
    nameUrdu: "ہارمونل پینل (ایف ایس ایچ، ایل ایچ، پرولیکٹن)",
    category: "Special Chemistry",
    description: "Endocrine assessment for fertility evaluation, cycle irregularities, and pituitary gland regulation.",
    descriptionUrdu: "بانجھ پن، ماہواری کی خرابیوں اور ہارمونل توازن کے لیے خصوصی جانچ۔",
    originalPrice: 5800,
    discountedPrice: 3480,
    sampleType: "Serum",
    preparationInstructions: "Collect on recommended day of menstrual cycle as advised by gynecologist.",
    preparationInstructionsUrdu: "گائناکالوجسٹ کی تجویز کے مطابق مناسب دن پر نمونہ دیں۔",
    deliveryTimeHours: "24 Hours",
    popular: false,
    isActive: true
  },
  {
    id: "test-dengue",
    name: "Dengue NS1 Antigen & Dengue Serology",
    nameUrdu: "ڈینگی این ایس 1 اینٹیجن اور اینٹی باڈیز",
    category: "Serology",
    description: "Rapid, accurate detection of acute dengue viral infection during early fever spikes.",
    descriptionUrdu: "بخار کے ابتدائی دنوں میں ڈینگی وائرس کی فوری اور مصدقہ تشخیص۔",
    originalPrice: 2500,
    discountedPrice: 1500,
    sampleType: "Blood / Serum",
    preparationInstructions: "No fasting needed. Urgent emergency reporting available.",
    preparationInstructionsUrdu: "کسی پرہیز کی ضرورت نہیں، فوری ایمرجنسی رپورٹ دستیاب ہے۔",
    deliveryTimeHours: "1 to 2 Hours",
    popular: true,
    isActive: true
  }
];

const initialPackages: TestPackage[] = [
  {
    id: "pkg-opening-40",
    title: "Grand Opening 40% OFF Wellness Package",
    titleUrdu: "افتتاحی 40 فیصد رعایت ویلنس پیکج",
    description: "Complete vital organ screening covering blood count, liver, kidneys, lipid profile, and blood sugar as advertised on official clinic launch banner.",
    descriptionUrdu: "خون، جگر، گردے، کولیسٹرول اور شوگر کا مکمل اور سستا ترین افتتاحی ٹیسٹ پیکج۔",
    testCount: 6,
    testNames: ["CBC with ESR", "Blood Sugar Fasting", "Lipid Profile Complete", "LFT (Liver Panel)", "RFT (Kidney Panel)", "Urine Routine Examination"],
    originalPrice: 6500,
    discountedPrice: 3900,
    discountBadge: "40% OFF",
    popular: true,
    validUntil: "2026-12-31",
    isActive: true
  },
  {
    id: "pkg-diabetic-cardiac",
    title: "Executive Diabetic & Cardiac Care Profile",
    titleUrdu: "ایگزیکٹو شوگر اور دل کی نگہداشت کا پیکج",
    description: "Advanced monitoring for patients with hypertension or diabetes to safeguard heart, eyes, and kidney health.",
    descriptionUrdu: "شوگر اور بلڈ پریشر کے مریضوں کے لیے دل اور گردوں کی حفاظت کا جدید پینل۔",
    testCount: 5,
    testNames: ["HbA1c (3 Month Average)", "Lipid Profile Complete", "Blood Sugar Fasting", "Renal Function (RFT)", "Urine Routine (Protein Check)"],
    originalPrice: 7000,
    discountedPrice: 4200,
    discountBadge: "40% OFF",
    popular: true,
    validUntil: "2026-12-31",
    isActive: true
  },
  {
    id: "pkg-womens-vital",
    title: "Women's Health & Hormonal Balance Screen",
    titleUrdu: "خواتین کی صحت اور ہارمونز کا سکریننگ پیکج",
    description: "Comprehensive hormonal and nutritional panel designed by our consulting gynecologist for fatigue, hair fall, and metabolic health.",
    descriptionUrdu: "خواتین کے لیے وٹامن ڈی، تھائیرائیڈ اور خون کی کمی کی مکمل جانچ۔",
    testCount: 5,
    testNames: ["CBC with ESR", "Thyroid Profile (TSH, T3, T4)", "Vitamin D Level", "Blood Sugar Random", "Serum Calcium"],
    originalPrice: 8500,
    discountedPrice: 5100,
    discountBadge: "40% OFF",
    popular: false,
    validUntil: "2026-12-31",
    isActive: true
  },
  {
    id: "pkg-senior-citizen",
    title: "Senior Citizen Comprehensive Health Screen",
    titleUrdu: "بزرگ شہریوں کے لیے جامع ہیلتھ چیک اپ",
    description: "Complete geriatric baseline panel covering liver, renal, cardiovascular, diabetic, and bone health markers.",
    descriptionUrdu: "بزرگوں کے لیے جوڑوں، گردوں، جگر اور کولیسٹرول کا بھرپور طبی تجزیہ۔",
    testCount: 7,
    testNames: ["CBC with ESR", "LFT Complete", "RFT with Uric Acid", "Lipid Profile", "Blood Sugar Fasting", "Vitamin D Level", "Urine Routine"],
    originalPrice: 9500,
    discountedPrice: 5700,
    discountBadge: "40% OFF",
    popular: true,
    validUntil: "2026-12-31",
    isActive: true
  }
];

const initialGallery: GalleryMediaItem[] = [
  {
    id: "gal-1",
    type: "image",
    title: "Clinic Storefront & Luminous 3D Signboard",
    titleUrdu: "کلینک کا بیرونی منظر اور روشن سائن بورڈ",
    category: "Exterior",
    url: "/src/assets/images/hero_clinic_diagnostic_1790651599920.jpg",
    caption: "Aitemad Diagnostic Center & Clinical Lab illuminated entrance at Bangash Street, near Car Chowk Rawalpindi.",
    captionUrdu: "بنگش سٹریٹ، کار چوک راولپنڈی پر اعتماد ڈائیگنوسٹک سینٹر کا مرکزی اور روشن گیٹ۔",
    featured: true,
    date: "2026-09"
  },
  {
    id: "gal-2",
    type: "image",
    title: "Clinical Laboratory & Automated Analyzer Station",
    titleUrdu: "جدید کلینیکل لیبارٹری اور آٹومیٹڈ اینالائزرز",
    category: "Laboratory",
    url: "/src/assets/images/lab_analyzer_equipment_1790651617627.jpg",
    caption: "High-precision DH-26 hematology analyzers, centrifuge, and certified test stations for reliable clinical findings.",
    captionUrdu: "انتہائی مستند ٹیسٹ نتائج کے لیے جدید آٹومیٹڈ ہیماٹولوجی اینالائزر اور سینٹری فیوج مشینیں",
    featured: true,
    date: "2026-09"
  },
  {
    id: "gal-3",
    type: "image",
    title: "Doctor Consultation Room & Medical Examination Suite",
    titleUrdu: "ڈاکٹر کنسلٹیشن روم اور معائنہ کا کمرہ",
    category: "OPD",
    url: "/src/assets/images/doctor_consultation_opd_1790651637185.jpg",
    caption: "Comfortable private doctor office with examination beds, blood pressure monitoring, and hygienic consultation setup.",
    captionUrdu: "ڈاکٹر کے معائنے کے لیے پرسکون کمرہ بمعہ معائنہ بیڈ اور چیک اپ کا جدید سامان۔",
    featured: true,
    date: "2026-09"
  },
  {
    id: "gal-4",
    type: "image",
    title: "Clinic Pharmacy & Prescription Dispensing Desk",
    titleUrdu: "کلینک فارمیسی اور ادویات کی فراہمی کا کاؤنٹر",
    category: "Pharmacy",
    url: "/src/assets/images/pharmacy_counter_medicines_1790651651380.jpg",
    caption: "Organized pharmacy shelves with verified prescription medications, injectables, and healthcare essentials.",
    captionUrdu: "مستند ادویات اور ضروری طبی سامان سے آراستہ جدید فارمیسی کاؤنٹر۔",
    featured: true,
    date: "2026-09"
  },
  {
    id: "gal-5",
    type: "video",
    title: "Inside Aitemad Diagnostic Center — Complete Facility Tour",
    titleUrdu: "اعتماد ڈائیگنوسٹک سینٹر کا اندرونی جائزہ اور ٹور",
    category: "Reception",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "/src/assets/images/hero_clinic_diagnostic_1790651599920.jpg",
    caption: "Walkthrough of our clean reception counter, turf corridor, specialized doctor suites, and clinical laboratory.",
    captionUrdu: "کلینک کے استقبالیہ، صاف ستھری راہداری، کنسلٹیشن رومز اور جدید لیبارٹری کی ویڈیو جھلک۔",
    featured: true,
    date: "2026-09"
  },
  {
    id: "gal-6",
    type: "video",
    title: "Diagnostic Equipment & Analyzer Calibration Video",
    titleUrdu: "جدید تشخیصی اینالائزر اور ٹیسٹنگ کا عملی طریقہ کار",
    category: "Equipment",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "/src/assets/images/lab_analyzer_equipment_1790651617627.jpg",
    caption: "Laboratory technologist running hematology test samples and calibrating automated digital test readout.",
    captionUrdu: "لیبارٹری ٹیکنالوجسٹ کے ذریعے خون کے نمونوں کا خودکار تجزیہ اور ٹیسٹ ریڈنگ۔",
    featured: true,
    date: "2026-09"
  },
  {
    id: "gal-7",
    type: "video",
    title: "Grand Opening Ceremony & Community Welcome Event",
    titleUrdu: "شاندار افتتاحی تقریب اور معزز مہمانان گرامی",
    category: "Opening",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnailUrl: "/src/assets/images/hero_clinic_diagnostic_1790651599920.jpg",
    caption: "Historic opening day banner, ribbon cutting ceremony, and community dignitaries celebrating healthcare launch in Rawalpindi.",
    captionUrdu: "راولپنڈی میں اعتماد ڈائیگنوسٹک سینٹر کی افتتاحی تقریب، فیتہ کاٹنے کی تقریب اور معززین علاقہ کی شرکت۔",
    featured: true,
    date: "2026-09"
  }
];

const initialAppointments: Appointment[] = [
  {
    id: "apt-101",
    bookingRef: "AIT-2026-7821",
    patientName: "Kamran Akram",
    patientPhone: "0300-5544332",
    patientEmail: "kamran@gmail.com",
    gender: "Male",
    age: 42,
    department: "OPD",
    doctorId: "doc-3",
    doctorName: "Dr. Hamza Bangash",
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: "11:00 AM",
    appointmentType: "Clinic Visit",
    notes: "Follow-up checkup for seasonal flu and throat irritation.",
    status: "Confirmed",
    internalNotes: "Patient verified via WhatsApp.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: "apt-102",
    bookingRef: "AIT-2026-8942",
    patientName: "Mrs. Shazia Batool",
    patientPhone: "0333-9876543",
    gender: "Female",
    age: 34,
    department: "Gynecologist",
    doctorId: "doc-2",
    doctorName: "Dr. Ayesha Noor",
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: "04:30 PM",
    appointmentType: "Clinic Visit",
    notes: "Second trimester routine antenatal checkup.",
    status: "Pending",
    internalNotes: "Awaiting final confirmation call.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "apt-103",
    bookingRef: "AIT-2026-9104",
    patientName: "Haji Abdul Rehman",
    patientPhone: "0312-7654321",
    patientEmail: "rehman.haji@yahoo.com",
    gender: "Male",
    age: 63,
    department: "Laboratory",
    testIds: ["test-cbc", "test-bs", "test-lft", "test-rft"],
    testNames: ["CBC with ESR", "Blood Sugar Fasting", "LFT", "RFT"],
    appointmentDate: new Date(Date.now() + 3600000 * 24).toISOString().split('T')[0],
    timeSlot: "08:30 AM",
    appointmentType: "Home Sample Collection",
    homeAddress: "House 24, Street 9, Gulraiz Phase 6, Rawalpindi",
    notes: "Patient is senior citizen, fasting blood sample required.",
    status: "Confirmed",
    internalNotes: "Phlebotomist assigned: Asif (0311-8302933)",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "apt-104",
    bookingRef: "AIT-2026-4519",
    patientName: "Tariq Mehmood",
    patientPhone: "0345-6789012",
    gender: "Male",
    age: 51,
    department: "Medical Specialist",
    doctorId: "doc-1",
    doctorName: "Dr. Muhammad Tahir",
    appointmentDate: new Date(Date.now() - 3600000 * 48).toISOString().split('T')[0],
    timeSlot: "05:00 PM",
    appointmentType: "Clinic Visit",
    notes: "Diabetes medicine adjustment and lipid profile review.",
    status: "Completed",
    internalNotes: "Prescribed 30-day regimen.",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 44).toISOString()
  }
];

const initialPatients: Patient[] = [
  {
    id: "pat-1",
    name: "Kamran Akram",
    phone: "0300-5544332",
    email: "kamran@gmail.com",
    gender: "Male",
    age: 42,
    address: "Bostan Khan Road, Rawalpindi",
    registeredAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
  },
  {
    id: "pat-2",
    name: "Mrs. Shazia Batool",
    phone: "0333-9876543",
    email: "shazia@outlook.com",
    gender: "Female",
    age: 34,
    address: "Gulraiz Phase 6, Rawalpindi",
    registeredAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    id: "pat-3",
    name: "Haji Abdul Rehman",
    phone: "0312-7654321",
    email: "rehman.haji@yahoo.com",
    gender: "Male",
    age: 63,
    address: "House 24, Street 9, Gulraiz Phase 6, Rawalpindi",
    registeredAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  }
];

const initialReports: LaboratoryReport[] = [
  {
    id: "rep-101",
    reportNumber: "REP-AIT-9041",
    patientName: "Kamran Akram",
    patientPhone: "0300-5544332",
    patientAge: 42,
    patientGender: "Male",
    appointmentRef: "AIT-2026-7821",
    testCategory: "Hematology",
    testName: "Complete Blood Count (CBC) with ESR",
    sampleCollectedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    reportDate: new Date(Date.now() - 3600000 * 20).toISOString().split('T')[0],
    pathologistName: "Dr. Sajid Mehmood (M.Phil Haematology)",
    status: "Ready",
    results: [
      { parameter: "Hemoglobin (Hb)", value: "14.2", unit: "g/dL", referenceRange: "13.0 - 17.5", flag: "Normal" },
      { parameter: "Total Leukocyte Count (TLC)", value: "7,800", unit: "/cumm", referenceRange: "4,000 - 11,000", flag: "Normal" },
      { parameter: "Platelet Count", value: "245,000", unit: "/cumm", referenceRange: "150,000 - 450,000", flag: "Normal" },
      { parameter: "Erythrocyte Sedimentation Rate (ESR)", value: "14", unit: "mm/1st hr", referenceRange: "0 - 15", flag: "Normal" },
      { parameter: "Hematocrit (PCV)", value: "43.5", unit: "%", referenceRange: "40 - 50", flag: "Normal" }
    ],
    doctorRemarks: "Normal hemogram. No evidence of anemia or acute bacterial leukocytosis."
  },
  {
    id: "rep-102",
    reportNumber: "REP-AIT-9055",
    patientName: "Tariq Mehmood",
    patientPhone: "0345-6789012",
    patientAge: 51,
    patientGender: "Male",
    appointmentRef: "AIT-2026-4519",
    testCategory: "Special Chemistry & Routine",
    testName: "Blood Sugar Fasting & HbA1c Panel",
    sampleCollectedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    reportDate: new Date(Date.now() - 3600000 * 44).toISOString().split('T')[0],
    pathologistName: "Dr. Sajid Mehmood (M.Phil Haematology)",
    status: "Ready",
    results: [
      { parameter: "Fasting Blood Sugar", value: "138", unit: "mg/dL", referenceRange: "70 - 100", flag: "High" },
      { parameter: "HbA1c (Glycated Hb)", value: "6.9", unit: "%", referenceRange: "< 5.7 (Normal), 5.7 - 6.4 (Pre-diabetic), >= 6.5 (Diabetic)", flag: "High" },
      { parameter: "Estimated Average Glucose", value: "151", unit: "mg/dL", referenceRange: "< 117", flag: "High" }
    ],
    doctorRemarks: "Fair glycemic control. Continue medication as advised by Dr. Muhammad Tahir and maintain low glycemic diet."
  }
];

const initialAuditLogs: AuditLogItem[] = [
  {
    id: "log-1",
    action: "System Initialized",
    details: "Aitemad Diagnostic Center production database seeded with authentic clinic services and doctors.",
    performedBy: "System",
    timestamp: new Date().toISOString()
  }
];

class DataStore {
  private state: DatabaseState;

  constructor() {
    this.state = this.load();
  }

  private load(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to load DB file, using default seed:", e);
    }

    const defaultState: DatabaseState = {
      settings: initialSettings,
      departments: initialDepartments,
      doctors: initialDoctors,
      tests: initialTests,
      packages: initialPackages,
      appointments: initialAppointments,
      patients: initialPatients,
      reports: initialReports,
      gallery: initialGallery,
      messages: [],
      auditLogs: initialAuditLogs
    };

    this.save(defaultState);
    return defaultState;
  }

  public save(customState?: DatabaseState): void {
    const toSave = customState || this.state;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (e) {
      console.error("Failed to save DB file:", e);
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public logAudit(action: string, details: string, performedBy = "Admin"): void {
    const log: AuditLogItem = {
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      action,
      details,
      performedBy,
      timestamp: new Date().toISOString()
    };
    this.state.auditLogs.unshift(log);
    if (this.state.auditLogs.length > 500) {
      this.state.auditLogs.pop();
    }
    this.save();
  }

  // --- Settings ---
  public updateSettings(newSettings: Partial<WebsiteSettings>): WebsiteSettings {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.logAudit("Update Website Settings", "Clinic contact details or branding updated");
    this.save();
    return this.state.settings;
  }

  // --- Appointments ---
  public getAppointments(): Appointment[] {
    return this.state.appointments;
  }

  public getAppointmentByRef(ref: string, phone?: string): Appointment | undefined {
    return this.state.appointments.find(a => {
      const matchRef = a.bookingRef.toUpperCase() === ref.trim().toUpperCase();
      if (!matchRef) return false;
      if (phone) {
        const cleanP1 = a.patientPhone.replace(/\D/g, '');
        const cleanP2 = phone.replace(/\D/g, '');
        return cleanP1.endsWith(cleanP2.slice(-7)) || cleanP2.endsWith(cleanP1.slice(-7));
      }
      return true;
    });
  }

  public createAppointment(data: Omit<Appointment, 'id' | 'bookingRef' | 'status' | 'createdAt' | 'updatedAt'>): { appointment: Appointment; doubleBooked: boolean } {
    // Double-booking check: If clinic visit with same doctor on same date & time slot
    let doubleBooked = false;
    if (data.appointmentType === 'Clinic Visit' && data.doctorId) {
      const existing = this.state.appointments.find(a =>
        a.doctorId === data.doctorId &&
        a.appointmentDate === data.appointmentDate &&
        a.timeSlot === data.timeSlot &&
        a.status !== 'Cancelled'
      );
      if (existing) {
        doubleBooked = true;
      }
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `AIT-${new Date().getFullYear()}-${randomSuffix}`;

    const newApt: Appointment = {
      id: "apt-" + Date.now(),
      bookingRef,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };

    this.state.appointments.unshift(newApt);

    // Auto register or update patient profile
    const existingPatient = this.state.patients.find(p => p.phone.replace(/\D/g, '') === data.patientPhone.replace(/\D/g, ''));
    if (!existingPatient) {
      this.state.patients.unshift({
        id: "pat-" + Date.now(),
        name: data.patientName,
        phone: data.patientPhone,
        email: data.patientEmail,
        gender: data.gender,
        age: data.age,
        address: data.homeAddress,
        registeredAt: new Date().toISOString()
      });
    }

    this.logAudit("New Appointment Booked", `Booking ${bookingRef} created for ${data.patientName} (${data.department})`, "Patient");
    this.save();

    return { appointment: newApt, doubleBooked };
  }

  public updateAppointmentStatus(id: string, status: Appointment['status'], internalNotes?: string): Appointment | null {
    const apt = this.state.appointments.find(a => a.id === id);
    if (!apt) return null;

    apt.status = status;
    if (internalNotes !== undefined) {
      apt.internalNotes = internalNotes;
    }
    apt.updatedAt = new Date().toISOString();

    this.logAudit("Appointment Status Changed", `Appointment ${apt.bookingRef} updated to ${status}`);
    this.save();
    return apt;
  }

  public rescheduleAppointment(id: string, newDate: string, newTime: string): Appointment | null {
    const apt = this.state.appointments.find(a => a.id === id);
    if (!apt) return null;

    const oldDate = apt.appointmentDate;
    const oldTime = apt.timeSlot;
    apt.appointmentDate = newDate;
    apt.timeSlot = newTime;
    apt.status = "Rescheduled";
    apt.updatedAt = new Date().toISOString();

    this.logAudit("Appointment Rescheduled", `Appointment ${apt.bookingRef} rescheduled from ${oldDate} ${oldTime} to ${newDate} ${newTime}`);
    this.save();
    return apt;
  }

  public cancelAppointment(id: string, reason?: string): Appointment | null {
    const apt = this.state.appointments.find(a => a.id === id);
    if (!apt) return null;

    apt.status = "Cancelled";
    if (reason) {
      apt.internalNotes = (apt.internalNotes ? apt.internalNotes + " | " : "") + "Cancellation Reason: " + reason;
    }
    apt.updatedAt = new Date().toISOString();

    this.logAudit("Appointment Cancelled", `Appointment ${apt.bookingRef} was cancelled. Reason: ${reason || 'N/A'}`);
    this.save();
    return apt;
  }

  // --- Tests & Packages ---
  public updateTest(id: string, testData: Partial<LaboratoryTest>): LaboratoryTest | null {
    const idx = this.state.tests.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.state.tests[idx] = { ...this.state.tests[idx], ...testData };
    this.logAudit("Update Laboratory Test", `Test ${this.state.tests[idx].name} updated`);
    this.save();
    return this.state.tests[idx];
  }

  public createTest(test: Omit<LaboratoryTest, 'id'>): LaboratoryTest {
    const newTest: LaboratoryTest = {
      id: "test-" + Date.now(),
      ...test
    };
    this.state.tests.push(newTest);
    this.logAudit("Created Laboratory Test", `New test ${newTest.name} added`);
    this.save();
    return newTest;
  }

  public deleteTest(id: string): boolean {
    const idx = this.state.tests.findIndex(t => t.id === id);
    if (idx === -1) return false;
    const deleted = this.state.tests.splice(idx, 1)[0];
    this.logAudit("Deleted Laboratory Test", `Test ${deleted.name} removed`);
    this.save();
    return true;
  }

  // --- Reports ---
  public getReports(phone?: string): LaboratoryReport[] {
    if (!phone) return this.state.reports;
    const cleanSearch = phone.replace(/\D/g, '');
    return this.state.reports.filter(r => r.patientPhone.replace(/\D/g, '').endsWith(cleanSearch.slice(-7)));
  }

  public createReport(reportData: Omit<LaboratoryReport, 'id' | 'reportNumber'>): LaboratoryReport {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reportNumber = `REP-AIT-${randomSuffix}`;

    const newReport: LaboratoryReport = {
      id: "rep-" + Date.now(),
      reportNumber,
      ...reportData
    };
    this.state.reports.unshift(newReport);
    this.logAudit("Created Laboratory Report", `Report ${reportNumber} issued for ${reportData.patientName}`);
    this.save();
    return newReport;
  }

  // --- Gallery ---
  public addGalleryItem(item: Omit<GalleryMediaItem, 'id'>): GalleryMediaItem {
    const newItem: GalleryMediaItem = {
      id: "gal-" + Date.now(),
      ...item
    };
    this.state.gallery.unshift(newItem);
    this.logAudit("Added Gallery Media", `Media item ${newItem.title} added`);
    this.save();
    return newItem;
  }

  public deleteGalleryItem(id: string): boolean {
    const idx = this.state.gallery.findIndex(g => g.id === id);
    if (idx === -1) return false;
    const deleted = this.state.gallery.splice(idx, 1)[0];
    this.logAudit("Deleted Gallery Media", `Item ${deleted.title} removed`);
    this.save();
    return true;
  }

  // --- Contact Messages ---
  public addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const newMsg: ContactMessage = {
      id: "msg-" + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Unread',
      ...msg
    };
    this.state.messages.unshift(newMsg);
    this.logAudit("New Contact Inquiry", `Message from ${msg.name} (${msg.phone})`, "Website Visitor");
    this.save();
    return newMsg;
  }

  public updateMessageStatus(id: string, status: ContactMessage['status']): boolean {
    const msg = this.state.messages.find(m => m.id === id);
    if (!msg) return false;
    msg.status = status;
    this.save();
    return true;
  }

  // --- Doctors ---
  public updateDoctor(id: string, docData: Partial<Doctor>): Doctor | null {
    const idx = this.state.doctors.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.state.doctors[idx] = { ...this.state.doctors[idx], ...docData };
    this.logAudit("Updated Doctor Profile", `Doctor ${this.state.doctors[idx].name} updated`);
    this.save();
    return this.state.doctors[idx];
  }

  // --- Backup & Restore ---
  public exportBackup(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public restoreBackup(jsonContent: string): boolean {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed.settings || !parsed.appointments) {
        throw new Error("Invalid backup schema");
      }
      this.state = parsed;
      this.logAudit("Database Restored", "Full system database restored from JSON backup archive");
      this.save();
      return true;
    } catch (e) {
      console.error("Restore failed:", e);
      return false;
    }
  }
}

export const db = new DataStore();
