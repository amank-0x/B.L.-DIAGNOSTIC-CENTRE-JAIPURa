import {
  DiagnosticTest,
  HealthPackage,
  Booking,
  DiagnosticReport,
  WebsiteConfig,
  UserProfile,
  AdminActivityLog,
  AppNotification,
  Phlebotomist
} from '../types';
import { ALL_IMPORTED_TESTS, ALL_IMPORTED_PACKAGES } from './allTestsCatalogue';

export const INITIAL_AUTH_SETTINGS = {
  adminAuthorizedPhone: '9649183422',
  adminPin: 'BLDiag@9649#Admin',
  sessionTimeoutMinutes: 30,
  requireOtpForAdmin: false,
  allowPatientDemoLogin: false,
  otpLength: 4 as const,
  maxLoginAttempts: 5,
  jwtSecretConfigured: true
};

export const INITIAL_WEBSITE_CONFIG: WebsiteConfig = {
  centerName: 'B.L. DIAGNOSTIC CENTER',
  adminPhone: '9649183422',
  helplinePhone: '9649183422',
  alternatePhone: '9649183422',
  supportEmail: 'care@bl-diagnostic.in',
  centralLabAddress: 'Near Post Office, Kumbha Marg, Sector 11, Pratap Nagar, Jaipur - 302033',
  branchAddress: 'Near Post Office, Kumbha Marg, Sector 11, Pratap Nagar, Jaipur - 302033',
  operatingHours: 'Monday - Saturday: 7:00 AM to 9:00 PM | Sunday: 7:00 AM to 2:00 PM (Home Collection Available)',
  freeCollectionThreshold: 500,
  standardCollectionFee: 100,
  authSettings: INITIAL_AUTH_SETTINGS,
  bankDetails: {
    accountName: 'B.L. DIAGNOSTIC CENTER',
    accountNumber: '428705500240',
    bank: 'ICICI BANK',
    branch: 'Kumbha Marg, Pratap Nagar, Jaipur',
    ifsc: 'ICIC0004287',
    pan: 'AAKCR3900K',
    upiId: '9649183422@upi'
  }
};

export const INITIAL_PHLEBOTOMISTS: Phlebotomist[] = [
  { id: 'phleb-1', name: 'Vikram Choudhary', phone: '9829012345', vaccinationStatus: 'Fully Vaccinated (Double Dose + Booster)' },
  { id: 'phleb-2', name: 'Ramesh Kumawat', phone: '9414098765', vaccinationStatus: 'Fully Vaccinated (Double Dose + Booster)' },
  { id: 'phleb-3', name: 'Sunil Sharma', phone: '9782145678', vaccinationStatus: 'Fully Vaccinated (Double Dose + Booster)' }
];

export const TEST_CATEGORIES = [
  'All Tests',
  'Hematology',
  'Biochemistry',
  'Thyroid & Hormones',
  'Diabetes',
  'Vitamins & Minerals',
  'Cancer Markers',
  'Serology',
  'Microbiology',
  'Allergy & Immunity',
  'Histopathology',
  'Hormones & Fertility'
];

export const INITIAL_TESTS: DiagnosticTest[] = ALL_IMPORTED_TESTS;
export const INITIAL_PACKAGES: HealthPackage[] = ALL_IMPORTED_PACKAGES;

export const COLLECTION_SLOTS = [
  '06:30 AM - 08:00 AM (Early Fasting)',
  '08:00 AM - 09:30 AM (Morning Prime)',
  '09:30 AM - 11:00 AM (Morning Regular)',
  '11:00 AM - 12:30 PM (Mid-day Slot)',
  '04:30 PM - 06:00 PM (Evening Slot)'
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-101',
  name: 'Rahul Sharma',
  phone: '9828012345',
  mobileNumber: '9828012345',
  email: 'rahul.sharma@example.com',
  role: 'USER',
  status: 'ACTIVE',
  age: 34,
  gender: 'Male',
  createdAt: '2026-09-15T10:00:00Z',
  addresses: [
    {
      id: 'addr-1',
      userId: 'usr-101',
      label: 'Home',
      fullName: 'Rahul Sharma',
      mobileNumber: '9828012345',
      phone: '9828012345',
      addressLine: 'Flat 402, Royal Palms Heights, Queens Road, Vaishali Nagar',
      addressLine1: 'Flat 402, Royal Palms Heights, Queens Road',
      landmark: 'Near National Handloom',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302021',
      isDefault: true
    },
    {
      id: 'addr-2',
      userId: 'usr-101',
      label: 'Work',
      fullName: 'Rahul Sharma',
      mobileNumber: '9828012345',
      phone: '9828012345',
      addressLine: 'Tower B, 3rd Floor, Mahindra World City SEZ',
      addressLine1: 'Tower B, 3rd Floor, Mahindra World City SEZ',
      landmark: 'Near Club House',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302042',
      isDefault: false
    }
  ]
};

export const INITIAL_REPORT: DiagnosticReport = {
  id: 'rep-bl10241',
  bookingId: 'book-bl10241',
  bookingNumber: 'BL-10241',
  userId: 'usr-101',
  patientName: 'Rahul Sharma',
  patientAge: 34,
  patientGender: 'Male',
  testNames: ['COMPLETE BLOOD COUNT (CBC)', 'TSH (Thyroid Stimulating Hormone)'],
  reportStatus: 'PUBLISHED',
  uploadedAt: '2026-10-07T08:15:00Z',
  publishedAt: '2026-10-07T09:30:00Z',
  version: 1,
  results: [
    {
      parameter: 'Hemoglobin (Hb)',
      observedValue: '14.8',
      unit: 'g/dL',
      referenceInterval: '13.0 - 17.0',
      isAbnormal: false,
      method: 'Photometric / Cyanmethemoglobin'
    },
    {
      parameter: 'Total Leukocyte Count (TLC / WBC)',
      observedValue: '7,400',
      unit: 'cells/cu.mm',
      referenceInterval: '4,000 - 11,000',
      isAbnormal: false,
      method: 'Automated Electrical Impedance'
    },
    {
      parameter: 'Platelet Count',
      observedValue: '2,65,000',
      unit: '/cu.mm',
      referenceInterval: '1,50,000 - 4,50,000',
      isAbnormal: false,
      method: 'Electrical Impedance'
    },
    {
      parameter: 'RBC Count',
      observedValue: '5.12',
      unit: 'million/cu.mm',
      referenceInterval: '4.50 - 5.50',
      isAbnormal: false,
      method: 'Automated Cell Counter'
    },
    {
      parameter: 'Neutrophils',
      observedValue: '62',
      unit: '%',
      referenceInterval: '40 - 70',
      isAbnormal: false
    },
    {
      parameter: 'Lymphocytes',
      observedValue: '30',
      unit: '%',
      referenceInterval: '20 - 45',
      isAbnormal: false
    },
    {
      parameter: 'Monocytes',
      observedValue: '5',
      unit: '%',
      referenceInterval: '2 - 8',
      isAbnormal: false
    },
    {
      parameter: 'Eosinophils',
      observedValue: '3',
      unit: '%',
      referenceInterval: '1 - 6',
      isAbnormal: false
    },
    {
      parameter: 'Packed Cell Volume (PCV / Hematocrit)',
      observedValue: '44.2',
      unit: '%',
      referenceInterval: '40.0 - 50.0',
      isAbnormal: false
    },
    {
      parameter: 'TSH (Thyroid Stimulating Hormone)',
      observedValue: '2.45',
      unit: 'uIU/mL',
      referenceInterval: '0.35 - 4.94',
      isAbnormal: false,
      method: 'CLIA Chemiluminescence'
    }
  ],
  pathologistNotes: 'Hematological parameters and TSH are well within biologically expected reference intervals. No abnormal cell morphology detected on peripheral smear.',
  approvedBy: 'Dr. Vikas Singhal (M.D. Pathologist, Reg. 17562/61248) & Dr. Neha Gupta (M.D. Microbiologist, Reg. 29463/17683)'
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-bl10241',
    bookingNumber: 'BL-10241',
    userId: 'usr-101',
    userName: 'Rahul Sharma',
    userPhone: '9828012345',
    userEmail: 'rahul.sharma@example.com',
    address: {
      id: 'addr-1',
      userId: 'usr-101',
      label: 'Home',
      addressLine: 'Flat 402, Royal Palms Heights, Queens Road, Vaishali Nagar',
      landmark: 'Near National Handloom',
      city: 'Jaipur',
      pincode: '302021',
      isDefault: true
    },
    bookingDate: '2026-10-07',
    collectionSlot: '06:30 AM - 08:00 AM (Early Fasting)',
    subtotal: 400,
    collectionFee: 0,
    discount: 0,
    total: 400,
    paymentMode: 'UPI_ONLINE',
    paymentStatus: 'PAID',
    status: 'REPORT_PUBLISHED',
    statusHistory: [
      { status: 'NEW', timestamp: '2026-10-06T18:30:00Z', note: 'Booking placed online' },
      { status: 'CONFIRMED', timestamp: '2026-10-06T18:35:00Z', note: 'Slot reserved' },
      { status: 'COLLECTION_ASSIGNED', timestamp: '2026-10-06T20:00:00Z', note: 'Phlebotomist Vikram assigned' },
      { status: 'SAMPLE_COLLECTED', timestamp: '2026-10-07T07:15:00Z', note: 'Barcoded tubes drawn' },
      { status: 'SAMPLE_RECEIVED', timestamp: '2026-10-07T07:55:00Z', note: 'Accessioned at Central Lab' },
      { status: 'PROCESSING', timestamp: '2026-10-07T08:10:00Z', note: 'Run on automated analyzer' },
      { status: 'REPORT_READY', timestamp: '2026-10-07T09:15:00Z', note: 'Signed by Dr. Vikas Singhal' },
      { status: 'REPORT_PUBLISHED', timestamp: '2026-10-07T09:30:00Z', note: 'Published to Patient Portal' }
    ],
    assignedPhlebotomist: INITIAL_PHLEBOTOMISTS[0],
    sampleBarcode: 'BL26-0710-8841',
    items: [
      {
        id: 'bi-1',
        bookingId: 'book-bl10241',
        type: 'TEST',
        itemId: 'test-175',
        nameSnapshot: 'COMPLETE BLOOD COUNT (CBC)',
        priceSnapshot: 250,
        sampleSnapshot: '3 ml EDTA Blood'
      },
      {
        id: 'bi-2',
        bookingId: 'book-bl10241',
        type: 'TEST',
        itemId: 'test-41',
        nameSnapshot: 'TSH (Thyroid Stimulating Hormone)',
        priceSnapshot: 150,
        sampleSnapshot: '2 ml Plain Blood (Serum)'
      }
    ],
    reportId: 'rep-bl10241',
    createdAt: '2026-10-06T18:30:00Z'
  },
  {
    id: 'book-bl10242',
    bookingNumber: 'BL-10242',
    userId: 'usr-101',
    userName: 'Rahul Sharma (for Mother)',
    userPhone: '9828012345',
    address: {
      id: 'addr-1',
      userId: 'usr-101',
      label: 'Home',
      addressLine: 'Flat 402, Royal Palms Heights, Queens Road, Vaishali Nagar',
      landmark: 'Near National Handloom',
      city: 'Jaipur',
      pincode: '302021',
      isDefault: true
    },
    bookingDate: '2026-10-07',
    collectionSlot: '08:00 AM - 09:30 AM (Morning Prime)',
    subtotal: 1800,
    collectionFee: 0,
    discount: 100,
    total: 1700,
    paymentMode: 'CASH_ON_COLLECTION',
    paymentStatus: 'PAID',
    status: 'PROCESSING',
    statusHistory: [
      { status: 'NEW', timestamp: '2026-10-06T21:00:00Z', note: 'Booking submitted' },
      { status: 'CONFIRMED', timestamp: '2026-10-06T21:05:00Z', note: 'Booking confirmed' },
      { status: 'COLLECTION_ASSIGNED', timestamp: '2026-10-07T06:45:00Z', note: 'Assigned to Sunil Sharma' },
      { status: 'SAMPLE_COLLECTED', timestamp: '2026-10-07T08:35:00Z', note: 'Collected with ice packs' },
      { status: 'SAMPLE_RECEIVED', timestamp: '2026-10-07T09:10:00Z', note: 'Samples accessioned' },
      { status: 'PROCESSING', timestamp: '2026-10-07T09:20:00Z', note: 'Centrifugation in progress' }
    ],
    assignedPhlebotomist: INITIAL_PHLEBOTOMISTS[2],
    sampleBarcode: 'BL26-0710-9014',
    items: [
      {
        id: 'bi-3',
        bookingId: 'book-bl10242',
        type: 'TEST',
        itemId: 'test-44',
        nameSnapshot: 'Vitamin D 25-Hydroxy (D2 + D3)',
        priceSnapshot: 1200,
        sampleSnapshot: '2 ml Plain Blood (Serum)'
      },
      {
        id: 'bi-4',
        bookingId: 'book-bl10242',
        type: 'TEST',
        itemId: 'test-43',
        nameSnapshot: 'Vitamin B12 (Cyanocobalamin)',
        priceSnapshot: 600,
        sampleSnapshot: '2 ml Plain Blood (Serum)'
      }
    ],
    createdAt: '2026-10-06T21:00:00Z'
  },
  {
    id: 'book-bl10243',
    bookingNumber: 'BL-10243',
    userId: 'usr-102',
    userName: 'Priya Meena',
    userPhone: '9414123890',
    address: {
      id: 'addr-3',
      userId: 'usr-102',
      label: 'Home',
      addressLine: 'House 88, Lane 4, Mansarovar Sector 5',
      landmark: 'Behind Swarn Path Park',
      city: 'Jaipur',
      pincode: '302020',
      isDefault: true
    },
    bookingDate: '2026-10-07',
    collectionSlot: '09:30 AM - 11:00 AM (Morning Regular)',
    subtotal: 1000,
    collectionFee: 0,
    discount: 0,
    total: 1000,
    paymentMode: 'UPI_ONLINE',
    paymentStatus: 'PAID',
    status: 'COLLECTION_ASSIGNED',
    statusHistory: [
      { status: 'NEW', timestamp: '2026-10-07T06:00:00Z', note: 'New package booking' },
      { status: 'CONFIRMED', timestamp: '2026-10-07T06:15:00Z', note: 'Booking verified' },
      { status: 'COLLECTION_ASSIGNED', timestamp: '2026-10-07T07:00:00Z', note: 'Assigned to Ramesh Kumawat' }
    ],
    assignedPhlebotomist: INITIAL_PHLEBOTOMISTS[1],
    sampleBarcode: 'BL26-0710-9112',
    items: [
      {
        id: 'bi-5',
        bookingId: 'book-bl10243',
        type: 'PACKAGE',
        itemId: 'pkg-wellness-a',
        nameSnapshot: 'Royal - Wellness - A',
        priceSnapshot: 1000,
        sampleSnapshot: '1 ml Fluoride, 2 ml EDTA, 2 ml Serum'
      }
    ],
    createdAt: '2026-10-07T06:00:00Z'
  },
  {
    id: 'book-bl10244',
    bookingNumber: 'BL-10244',
    userId: 'usr-103',
    userName: 'Amit Singhania',
    userPhone: '9829988776',
    address: {
      id: 'addr-4',
      userId: 'usr-103',
      label: 'Home',
      addressLine: 'Villa 12, Golden Enclave, Sirsi Road',
      landmark: 'Near Bindayaka',
      city: 'Jaipur',
      pincode: '302012',
      isDefault: true
    },
    bookingDate: '2026-10-08',
    collectionSlot: '06:30 AM - 08:00 AM (Early Fasting)',
    subtotal: 2000,
    collectionFee: 0,
    discount: 0,
    total: 2000,
    paymentMode: 'CASH_ON_COLLECTION',
    paymentStatus: 'PENDING',
    status: 'CONFIRMED',
    statusHistory: [
      { status: 'NEW', timestamp: '2026-10-07T07:10:00Z', note: 'Booking received' },
      { status: 'CONFIRMED', timestamp: '2026-10-07T07:15:00Z', note: 'Slot scheduled for tomorrow' }
    ],
    items: [
      {
        id: 'bi-6',
        bookingId: 'book-bl10244',
        type: 'PACKAGE',
        itemId: 'pkg-wellness-c',
        nameSnapshot: 'Royal - Wellness - C (With Vitamin D, B12 & Testosterone)',
        priceSnapshot: 2000,
        sampleSnapshot: '1 ml Fluoride, 2 ml EDTA, 3 ml Serum'
      }
    ],
    createdAt: '2026-10-07T07:10:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-101',
    bookingId: 'book-bl10241',
    title: 'Diagnostic Report Ready & Published',
    message: 'Your lab report for Booking #BL-10241 (CBC + TSH) is verified and ready for download.',
    read: false,
    createdAt: '2026-10-07T09:30:00Z',
    type: 'REPORT'
  },
  {
    id: 'notif-2',
    userId: 'usr-101',
    bookingId: 'book-bl10242',
    title: 'Samples Under Processing',
    message: 'Samples for Booking #BL-10242 (Vitamin D + B12) arrived at Central Lab and are being analyzed.',
    read: true,
    createdAt: '2026-10-07T09:20:00Z',
    type: 'COLLECTION'
  },
  {
    id: 'notif-3',
    userId: 'usr-101',
    bookingId: 'book-bl10242',
    title: 'Phlebotomist Sunil Sharma On The Way',
    message: 'Phlebotomist Sunil Sharma (Ph: 9782145678) has started for your address for home sample collection.',
    read: true,
    createdAt: '2026-10-07T08:00:00Z',
    type: 'COLLECTION'
  }
];

export const INITIAL_ADMIN_LOGS: AdminActivityLog[] = [
  {
    id: 'log-1',
    adminId: 'admin-primary',
    adminPhone: '9649183422',
    action: 'PUBLISH_REPORT',
    entity: 'REPORT',
    entityId: 'rep-bl10241',
    details: 'Verified and published diagnostic report for Booking #BL-10241 (Patient: Rahul Sharma)',
    timestamp: '2026-10-07T09:30:00Z'
  },
  {
    id: 'log-2',
    adminId: 'admin-primary',
    adminPhone: '9649183422',
    action: 'UPDATE_BOOKING_STATUS',
    entity: 'BOOKING',
    entityId: 'book-bl10242',
    details: 'Changed status to PROCESSING for Booking #BL-10242',
    timestamp: '2026-10-07T09:20:00Z'
  },
  {
    id: 'log-3',
    adminId: 'admin-primary',
    adminPhone: '9649183422',
    action: 'ASSIGN_PHLEBOTOMIST',
    entity: 'BOOKING',
    entityId: 'book-bl10243',
    details: 'Assigned Phlebotomist Ramesh Kumawat to Booking #BL-10243',
    timestamp: '2026-10-07T07:00:00Z'
  },
  {
    id: 'log-4',
    adminId: 'admin-primary',
    adminPhone: '9649183422',
    action: 'PRICE_UPDATE',
    entity: 'TEST',
    entityId: 'test-175',
    details: 'Verified Complete Blood Count (CBC) at ₹250 / Corporate ₹75',
    timestamp: '2026-10-06T15:00:00Z'
  }
];
