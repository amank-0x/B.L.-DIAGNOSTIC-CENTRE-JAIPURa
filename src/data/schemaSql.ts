export const PRODUCTION_SCHEMA_SQL = `-- =====================================================================
-- B.L. DIAGNOSTIC CENTER — POSTGRESQL PRODUCTION SCHEMA
-- Run this script in your PostgreSQL database (Neon, Supabase, or any PostgreSQL):
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    age INTEGER DEFAULT 30,
    gender VARCHAR(20) DEFAULT 'Male',
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 3. SAVED ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT,
    label VARCHAR(50) DEFAULT 'Home',
    address_line TEXT NOT NULL,
    landmark VARCHAR(255),
    city VARCHAR(100) NOT NULL DEFAULT 'Jaipur',
    pincode VARCHAR(10) NOT NULL DEFAULT '302021',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TEST CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DIAGNOSTIC TESTS CATALOGUE
CREATE TABLE IF NOT EXISTS public.tests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    method VARCHAR(255),
    sample VARCHAR(255),
    instructions TEXT,
    description TEXT,
    reporting_time VARCHAR(100) DEFAULT 'Same Day (4 - 6 Hours)',
    general_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    corporate_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    home_collection_available BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tests_code ON public.tests(code);
CREATE INDEX IF NOT EXISTS idx_tests_category ON public.tests(category_name);

-- 6. HEALTH PACKAGES
CREATE TABLE IF NOT EXISTS public.packages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    parameters_count INTEGER DEFAULT 0,
    reporting_time VARCHAR(100) DEFAULT 'Same Day (6 - 8 Hours)',
    general_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    corporate_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sample_instructions TEXT,
    recommended_for TEXT,
    included_summary TEXT,
    active BOOLEAN DEFAULT TRUE,
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. BOOKINGS / ORDERS TABLE (Core)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_number VARCHAR(50) NOT NULL UNIQUE,
    user_id TEXT,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(255),
    address_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
    collection_slot VARCHAR(100) NOT NULL DEFAULT '07:00 AM - 08:00 AM',
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    collection_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_mode VARCHAR(50) DEFAULT 'CASH_ON_COLLECTION',
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    booking_status VARCHAR(50) DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_number ON public.bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(patient_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date DESC);

-- 8. BOOKING LINE ITEMS
CREATE TABLE IF NOT EXISTS public.booking_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL DEFAULT 'TEST',
    item_id VARCHAR(100) NOT NULL,
    name_snapshot VARCHAR(255) NOT NULL,
    price_snapshot NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sample_snapshot VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_items_booking ON public.booking_items(booking_id);

-- 9. BOOKING STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_booking ON public.booking_status_history(booking_id);

-- 10. PHLEBOTOMY FIELD COLLECTIONS
CREATE TABLE IF NOT EXISTS public.collections (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    collector_id VARCHAR(100),
    collector_name VARCHAR(255) DEFAULT 'Designated Phlebotomist',
    collector_phone VARCHAR(20) DEFAULT '9649183422',
    sample_barcode VARCHAR(100),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    slot VARCHAR(100) NOT NULL DEFAULT '07:00 AM - 08:00 AM',
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    collected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_booking ON public.collections(booking_id);

-- 11. DIAGNOSTIC REPORTS METADATA
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_number VARCHAR(50) NOT NULL,
    user_id TEXT,
    patient_name VARCHAR(255) NOT NULL,
    patient_age INTEGER DEFAULT 35,
    patient_gender VARCHAR(20) DEFAULT 'Male',
    results JSONB NOT NULL DEFAULT '[]'::jsonb,
    doctor_notes TEXT,
    approved_by VARCHAR(255) DEFAULT 'Dr. Vikas Singhal (M.D. Pathologist)',
    file_path TEXT,
    storage_bucket VARCHAR(100) DEFAULT 'reports',
    is_published BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_booking ON public.reports(booking_id);
CREATE INDEX IF NOT EXISTS idx_reports_number ON public.reports(booking_number);

-- 12. IMMUTABLE ACTIVITY AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    actor_id VARCHAR(100) DEFAULT 'admin',
    actor_role VARCHAR(50) DEFAULT 'SUPER_ADMIN',
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES & PERMISSIONS
-- Grants full operational read/write access to Supabase anon and authenticated roles
-- =====================================================================

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Permissive policies for bookings (allows online order placement & admin reading)
DROP POLICY IF EXISTS "Allow anon and auth all on bookings" ON public.bookings;
CREATE POLICY "Allow anon and auth all on bookings" ON public.bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth all on booking_items" ON public.booking_items;
CREATE POLICY "Allow anon and auth all on booking_items" ON public.booking_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth all on booking_status_history" ON public.booking_status_history;
CREATE POLICY "Allow anon and auth all on booking_status_history" ON public.booking_status_history FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth all on collections" ON public.collections;
CREATE POLICY "Allow anon and auth all on collections" ON public.collections FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth all on reports" ON public.reports;
CREATE POLICY "Allow anon and auth all on reports" ON public.reports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth all on users" ON public.users;
CREATE POLICY "Allow anon and auth all on users" ON public.users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth all on tests" ON public.tests;
CREATE POLICY "Allow anon and auth all on tests" ON public.tests FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth all on packages" ON public.packages;
CREATE POLICY "Allow anon and auth all on packages" ON public.packages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth all on categories" ON public.categories;
CREATE POLICY "Allow anon and auth all on categories" ON public.categories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth all on addresses" ON public.addresses;
CREATE POLICY "Allow anon and auth all on addresses" ON public.addresses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and auth all on activity_logs" ON public.activity_logs;
CREATE POLICY "Allow anon and auth all on activity_logs" ON public.activity_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Grant privileges to standard Supabase roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, postgres, service_role;

-- 13. SEED INITIAL TESTS & PACKAGES
INSERT INTO public.categories (name, slug, description, display_order)
VALUES 
  ('Hematology', 'hematology', 'Complete blood counts and blood cellular analysis', 1),
  ('Biochemistry', 'biochemistry', 'Liver, kidney, lipid, diabetes profiles', 2),
  ('Endocrinology', 'endocrinology', 'Thyroid, fertility and hormone testing', 3),
  ('Microbiology & Serology', 'serology', 'Infection and antibody panels', 4)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.tests (code, name, category_name, general_price, reporting_time, popular)
VALUES
  ('TEST-CBC', 'Complete Blood Count (CBC) with ESR', 'Hematology', 350.00, 'Same Day (3 - 4 Hours)', true),
  ('TEST-LIPID', 'Lipid Profile Comprehensive', 'Biochemistry', 650.00, 'Same Day (4 Hours)', true),
  ('TEST-LFT', 'Liver Function Test (LFT) with Enzymes', 'Biochemistry', 550.00, 'Same Day (4 Hours)', true),
  ('TEST-KFT', 'Kidney Function Test (KFT) with Electrolytes', 'Biochemistry', 600.00, 'Same Day (4 Hours)', true),
  ('TEST-THYROID', 'Thyroid Profile Total (T3, T4, TSH)', 'Endocrinology', 450.00, 'Same Day (5 Hours)', true),
  ('TEST-HBA1C', 'HbA1c Glycated Hemoglobin with Blood Glucose', 'Biochemistry', 450.00, 'Same Day (3 Hours)', true),
  ('TEST-VITD', 'Vitamin D 25-Hydroxy Total', 'Biochemistry', 990.00, 'Same Day (6 Hours)', true),
  ('TEST-VITB12', 'Vitamin B12 Cyanocobalamin', 'Biochemistry', 750.00, 'Same Day (6 Hours)', true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.packages (code, name, tagline, description, parameters_count, general_price, popular)
VALUES
  ('PKG-FULL-BODY', 'Comprehensive Full Body Wellness Profile', 'Complete head-to-toe screening with 78 parameters', 'Includes CBC, LFT, KFT, Lipid Profile, Thyroid, Blood Sugar, HbA1c, and Urine Routine.', 78, 1499.00, true),
  ('PKG-SENIOR-CITIZEN', 'Senior Citizen Active Care Package', 'Customized health monitoring for 60+ individuals', 'Comprehensive organ health and arthritis/bone density indicators.', 65, 1299.00, true),
  ('PKG-DIABETES-CARE', 'Diabetes Comprehensive Monitoring', 'Quarterly diabetic evaluation & organ protection', 'HbA1c, Fasting & PP Glucose, Serum Creatinine, Microalbumin, and Lipid Profile.', 32, 899.00, true)
ON CONFLICT (code) DO NOTHING;
`;
