import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve environment variables from Vite or Next.js conventions
const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://placeholder-bl-diagnostic.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  'placeholder-anon-key';

export const isSupabaseConfigured =
  supabaseUrl !== 'https://placeholder-bl-diagnostic.supabase.co' &&
  supabaseAnonKey !== 'placeholder-anon-key';

// Initialize Supabase Client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Storage Buckets Definition
export const STORAGE_BUCKETS = {
  REPORTS: 'reports',
  USER_DOCUMENTS: 'user-documents',
  WEBSITE_ASSETS: 'website-assets'
} as const;

/**
 * Report Storage Helper: Upload PDF Report into Supabase Storage 'reports' bucket
 */
export async function uploadReportPdfToSupabase(
  bookingNumber: string,
  file: Blob | File,
  filename?: string
): Promise<{ path: string; error: string | null }> {
  try {
    if (!isSupabaseConfigured) {
      // Local preview storage simulation
      const mockPath = `${bookingNumber}/${filename || `report-${bookingNumber}.pdf`}`;
      return { path: mockPath, error: null };
    }

    const cleanFilename = filename || `diagnostic-report-${bookingNumber}-${Date.now()}.pdf`;
    const filePath = `${bookingNumber}/${cleanFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.REPORTS)
      .upload(filePath, file, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return { path: filePath, error: uploadError.message };
    }

    return { path: filePath, error: null };
  } catch (err: any) {
    return { path: '', error: err.message || 'Storage upload failed' };
  }
}

/**
 * Report Storage Helper: Generate a secure Signed URL for authenticated patient report download
 */
export async function getSignedReportDownloadUrl(
  filePath: string,
  expiresInSeconds = 3600
): Promise<{ signedUrl: string | null; error: string | null }> {
  try {
    if (!isSupabaseConfigured) {
      return { signedUrl: null, error: null };
    }

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.REPORTS)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      return { signedUrl: null, error: error.message };
    }

    return { signedUrl: data.signedUrl, error: null };
  } catch (err: any) {
    return { signedUrl: null, error: err.message || 'Failed to create signed URL' };
  }
}

/**
 * Phone Number OTP Auth Helper for Supabase
 */
export async function sendSupabasePhoneOtp(phone: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!isSupabaseConfigured) {
      // Simulated OTP for immediate testing and preview environment
      return { success: true, message: 'OTP sent (Demo OTP: 123456)' };
    }

    const cleanPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    const { error } = await supabase.auth.signInWithOtp({
      phone: cleanPhone
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Verification code sent to your mobile.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'OTP dispatch failed.' };
  }
}

/**
 * Verify Supabase Phone OTP
 */
export async function verifySupabasePhoneOtp(
  phone: string,
  token: string
): Promise<{ success: boolean; session: any; error: string | null }> {
  try {
    if (!isSupabaseConfigured) {
      if (token === '123456' || token === '1234') {
        return { success: true, session: { user: { phone } }, error: null };
      }
      return { success: false, session: null, error: 'Invalid verification code.' };
    }

    const cleanPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: cleanPhone,
      token,
      type: 'sms'
    });

    if (error) {
      return { success: false, session: null, error: error.message };
    }

    return { success: true, session: data.session, error: null };
  } catch (err: any) {
    return { success: false, session: null, error: err.message || 'OTP verification failed' };
  }
}
