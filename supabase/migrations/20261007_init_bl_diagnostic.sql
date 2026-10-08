-- =====================================================================
-- B.L. DIAGNOSTIC CENTER — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supabase_auth_id UUID UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    age INTEGER DEFAULT 30,
    gender VARCHAR(20) DEFAULT 'Male' CHECK (gender IN ('Male', 'Female', 'Other')),
    role VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 2. SAVED ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home' CHECK (label IN ('Home', 'Work', 'Other')),
    address_line TEXT NOT NULL,
    landmark VARCHAR(255),
    city VARCHAR(100) NOT NULL DEFAULT 'Jaipur',
    pincode VARCHAR(10) NOT NULL DEFAULT '302021',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- 3. TEST CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DIAGNOSTIC TESTS CATALOGUE
CREATE TABLE IF NOT EXISTS public.tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100) NOT NULL,
    method VARCHAR(255),
    sample VARCHAR(255),
    instructions TEXT,
    description TEXT,
    reporting_time VARCHAR(100) DEFAULT 'Same Day',
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
CREATE INDEX IF NOT EXISTS idx_tests_active ON public.tests(active);

-- 5. HEALTH PACKAGES & PROFILES
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    parameters_count INTEGER DEFAULT 0,
    reporting_time VARCHAR(100) DEFAULT 'Same Day',
    general_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    corporate_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sample_instructions TEXT,
    recommended_for TEXT,
    included_summary TEXT,
    active BOOLEAN DEFAULT TRUE,
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PACKAGE TEST RELATIONS
CREATE TABLE IF NOT EXISTS public.package_tests (
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    PRIMARY KEY (package_id, test_id)
);

-- 7. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) NOT NULL UNIQUE, -- e.g. BLD-2026-0001
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(255),
    address_snapshot JSONB NOT NULL,
    booking_date DATE NOT NULL,
    collection_slot VARCHAR(100) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    collection_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_mode VARCHAR(50) DEFAULT 'CASH_ON_COLLECTION' CHECK (payment_mode IN ('CASH_ON_COLLECTION', 'UPI_ONLINE', 'CARD')),
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    booking_status VARCHAR(50) DEFAULT 'NEW' CHECK (booking_status IN (
        'NEW', 'CONFIRMED', 'COLLECTION_ASSIGNED', 'SAMPLE_COLLECTED',
        'SAMPLE_RECEIVED', 'PROCESSING', 'REPORT_READY', 'REPORT_PUBLISHED', 'COMPLETED', 'CANCELLED'
    )),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_number ON public.bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(patient_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);

-- 8. BOOKING LINE ITEMS
CREATE TABLE IF NOT EXISTS public.booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('TEST', 'PACKAGE')),
    item_id VARCHAR(100) NOT NULL,
    name_snapshot VARCHAR(255) NOT NULL,
    price_snapshot NUMERIC(10, 2) NOT NULL,
    sample_snapshot VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_items_booking ON public.booking_items(booking_id);

-- 9. BOOKING STATUS AUDIT TRAIL
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PHLEBOTOMY FIELD COLLECTIONS
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    collector_id VARCHAR(100),
    collector_name VARCHAR(255),
    collector_phone VARCHAR(20),
    sample_barcode VARCHAR(100),
    date DATE NOT NULL,
    slot VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'SCHEDULED' CHECK (status IN (
        'SCHEDULED', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'COLLECTED', 'FAILED'
    )),
    collected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_booking ON public.collections(booking_id);
CREATE INDEX IF NOT EXISTS idx_collections_status ON public.collections(status);

-- 11. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    transaction_reference VARCHAR(255),
    payment_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. DIAGNOSTIC REPORTS METADATA
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_number VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_age INTEGER,
    patient_gender VARCHAR(20),
    results JSONB NOT NULL DEFAULT '[]'::jsonb,
    doctor_notes TEXT,
    approved_by VARCHAR(255) DEFAULT 'Dr. Vikas Singhal (M.D. Pathologist) & Dr. Neha Gupta (M.D. Microbiologist)',
    file_path TEXT, -- Supabase Storage file key in 'reports' bucket
    storage_bucket VARCHAR(100) DEFAULT 'reports',
    is_published BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_booking ON public.reports(booking_id);
CREATE INDEX IF NOT EXISTS idx_reports_user ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_booking_num ON public.reports(booking_number);

-- 13. REPORT VERSIONING
CREATE TABLE IF NOT EXISTS public.report_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    change_summary TEXT,
    uploaded_by VARCHAR(255) DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. IN-APP NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO' CHECK (type IN ('INFO', 'BOOKING', 'COLLECTION', 'REPORT', 'PAYMENT')),
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- 15. ADMIN USERS
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) NOT NULL UNIQUE, -- Primary Admin: 9649183422
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ADMIN' CHECK (role IN ('ADMIN', 'SUPER_ADMIN')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Primary Admin Phone 9649183422
INSERT INTO public.admin_users (phone, full_name, role)
VALUES ('9649183422', 'B.L. Diagnostic Chief Admin', 'SUPER_ADMIN')
ON CONFLICT (phone) DO NOTHING;

-- 16. IMMUTABLE ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id VARCHAR(100),
    actor_role VARCHAR(50) DEFAULT 'ADMIN',
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at DESC);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Tests & Packages: Public viewable, admin writable
CREATE POLICY "Public can view active tests" ON public.tests FOR SELECT USING (active = true);
CREATE POLICY "Public can view active packages" ON public.packages FOR SELECT USING (active = true);

-- Bookings: Users can view their own bookings, service role or admin can manage all
CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() IN (SELECT supabase_auth_id FROM public.users WHERE role IN ('ADMIN', 'SUPER_ADMIN'))
);

-- Reports: Private by default, accessible by booking owner or admin
CREATE POLICY "Users view own reports" ON public.reports FOR SELECT USING (
    (user_id = auth.uid() AND is_published = true) OR
    auth.uid() IN (SELECT supabase_auth_id FROM public.users WHERE role IN ('ADMIN', 'SUPER_ADMIN'))
);
