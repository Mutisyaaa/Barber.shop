-- ====================================================================
-- THE NOBLE BLADE BARBER LOUNGE - CORE RELATIONAL DATABASE SCHEMA
-- Target DB: PostgreSQL (or Supabase / Neon / RDS)
-- ====================================================================

-- 1. Services Table
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Haircut',
    price NUMERIC(10, 2) NOT NULL,
    duration_min INTEGER NOT NULL CHECK (duration_min > 0),
    description TEXT,
    popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Barbers Table
CREATE TABLE IF NOT EXISTS barbers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nickname VARCHAR(50),
    photo_url TEXT,
    specialty VARCHAR(150),
    rating NUMERIC(2, 1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    working_hours JSONB NOT NULL DEFAULT '{"start": "08:30", "end": "20:00"}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    visit_count INTEGER DEFAULT 0,
    last_visit DATE,
    no_show_count INTEGER DEFAULT 0,
    preferred_barber_id VARCHAR(50) REFERENCES barbers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    client_id VARCHAR(50) REFERENCES clients(id) ON DELETE CASCADE,
    client_name VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    barber_id VARCHAR(50) REFERENCES barbers(id) ON DELETE RESTRICT,
    service_id VARCHAR(50) REFERENCES services(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' 
        CHECK (status IN ('confirmed', 'arrived', 'completed', 'no_show', 'cancelled')),
    deposit_paid BOOLEAN DEFAULT TRUE,
    deposit_amount NUMERIC(10, 2) DEFAULT 300.00,
    mpesa_ref VARCHAR(50),
    notes TEXT,
    is_walkin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for rapid slot availability queries
CREATE INDEX IF NOT EXISTS idx_appointments_lookup 
ON appointments (barber_id, appointment_date, status);

-- 5. Payments Table (Daraja M-Pesa STK Transactions)
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    appointment_id VARCHAR(50) REFERENCES appointments(id) ON DELETE CASCADE,
    mpesa_ref VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    merchant_request_id VARCHAR(100),
    checkout_request_id VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'completed' 
        CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Time Off & Shifts Blocker
CREATE TABLE IF NOT EXISTS time_off (
    id VARCHAR(50) PRIMARY KEY,
    barber_id VARCHAR(50) REFERENCES barbers(id) ON DELETE CASCADE,
    block_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    reason VARCHAR(150) DEFAULT 'Lunch Break',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Walk-In Queue
CREATE TABLE IF NOT EXISTS walkin_queue (
    id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20),
    service_id VARCHAR(50) REFERENCES services(id) ON DELETE SET NULL,
    barber_id VARCHAR(50) REFERENCES barbers(id) ON DELETE SET NULL,
    estimated_wait_min INTEGER DEFAULT 15,
    status VARCHAR(20) DEFAULT 'waiting' 
        CHECK (status IN ('waiting', 'seated', 'completed', 'cancelled')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Shop Global Settings
CREATE TABLE IF NOT EXISTS shop_settings (
    id VARCHAR(20) PRIMARY KEY DEFAULT 'primary',
    shop_name VARCHAR(100) NOT NULL DEFAULT 'The Noble Blade',
    tagline VARCHAR(200) DEFAULT 'Premium Grooming & Executive Barber Lounge',
    location TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    instagram VARCHAR(50),
    opening_time TIME DEFAULT '08:30',
    closing_time TIME DEFAULT '20:00',
    deposit_amount NUMERIC(10, 2) DEFAULT 300.00,
    cancellation_window_hours INTEGER DEFAULT 2,
    slot_step_min INTEGER DEFAULT 15,
    currency VARCHAR(10) DEFAULT 'KES',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

