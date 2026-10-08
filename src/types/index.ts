export type Role = 'user' | 'admin';

export type BookingStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'COLLECTION_ASSIGNED'
  | 'SAMPLE_COLLECTED'
  | 'SAMPLE_RECEIVED'
  | 'PROCESSING'
  | 'REPORT_READY'
  | 'REPORT_PUBLISHED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'SAMPLE_RECOLLECTION_REQUIRED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'CASH_ON_COLLECTION' | 'FAILED';

export interface UserAddress {
  id: string;
  userId: string;
  label: 'Home' | 'Work' | 'Other';
  fullName?: string;
  mobileNumber?: string;
  phone?: string;
  addressLine: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark: string;
  city: string;
  state?: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  mobileNumber?: string;
  email?: string;
  role?: string;
  status?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  createdAt: string;
  addresses: UserAddress[];
}

export interface DiagnosticTest {
  id: string;
  code: string;
  name: string;
  category: string;
  method: string;
  sample: string;
  instructions: string;
  description: string;
  reportingTime: string;
  generalPrice: number;
  corporatePrice: number;
  homeCollectionAvailable: boolean;
  active: boolean;
  popular?: boolean;
}

export interface HealthPackage {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  includedParametersCount: number;
  includedSummary: string;
  includedTests: string[];
  reportingTime: string;
  generalPrice: number;
  corporatePrice: number;
  sampleInstructions: string;
  recommendedFor: string;
  active: boolean;
  popular?: boolean;
}

export interface CartItem {
  id: string; // unique cart item id
  type: 'TEST' | 'PACKAGE';
  itemId: string;
  name: string;
  price: number;
  sample: string;
  reportingTime: string;
}

export interface BookingItem {
  id: string;
  bookingId: string;
  type: 'TEST' | 'PACKAGE';
  itemId: string;
  nameSnapshot: string;
  priceSnapshot: number;
  sampleSnapshot: string;
}

export interface Phlebotomist {
  id: string;
  name: string;
  phone: string;
  vaccinationStatus: string;
  currentLocation?: string;
}

export interface LabReportResultItem {
  parameter: string;
  observedValue: string;
  unit: string;
  referenceInterval: string;
  isAbnormal?: boolean;
  method?: string;
}

export interface DiagnosticReport {
  id: string;
  bookingId: string;
  bookingNumber: string;
  userId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  testNames: string[];
  reportStatus: 'DRAFT' | 'READY' | 'PUBLISHED';
  uploadedAt: string;
  publishedAt?: string;
  fileUrl?: string;
  downloadUrl?: string;
  version: number;
  results: LabReportResultItem[];
  pathologistNotes?: string;
  approvedBy: string; // e.g. Dr. Vikas Singhal & Dr. Neha Gupta
}

export interface Booking {
  id: string;
  bookingNumber: string; // e.g. BL-10241
  userId: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  address: UserAddress;
  bookingDate: string; // scheduled collection date YYYY-MM-DD
  collectionSlot: string; // e.g. 07:00 AM - 08:30 AM
  subtotal: number;
  collectionFee: number;
  discount: number;
  total: number;
  paymentMode: 'CASH_ON_COLLECTION' | 'UPI_ONLINE' | 'CARD';
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  statusHistory: {
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }[];
  assignedPhlebotomist?: Phlebotomist;
  sampleBarcode?: string;
  items: BookingItem[];
  reportId?: string;
  createdAt: string;
  notes?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // 'all' or user specific
  bookingId?: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'BOOKING' | 'COLLECTION' | 'REPORT' | 'ANNOUNCEMENT';
}

export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminPhone: string;
  action: string;
  entity: 'BOOKING' | 'TEST' | 'PACKAGE' | 'REPORT' | 'USER' | 'SETTINGS';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface AuthSettings {
  adminAuthorizedPhone: string;
  adminPin: string;
  sessionTimeoutMinutes: number;
  requireOtpForAdmin: boolean;
  allowPatientDemoLogin: boolean;
  otpLength: 4 | 6;
  maxLoginAttempts: number;
  jwtSecretConfigured: boolean;
  supabaseAuthActive: boolean;
}

export interface WebsiteConfig {
  centerName: string;
  adminPhone: string;
  helplinePhone: string;
  alternatePhone: string;
  supportEmail: string;
  centralLabAddress: string;
  branchAddress: string;
  operatingHours: string;
  freeCollectionThreshold: number;
  standardCollectionFee: number;
  authSettings?: AuthSettings;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bank: string;
    branch: string;
    ifsc: string;
    pan: string;
    upiId: string;
  };
}
