-- database/schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Alerts Table (CAP-inspired)
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    external_id VARCHAR(255) UNIQUE,
    state VARCHAR(50) NOT NULL, -- 'Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala'
    district VARCHAR(100),
    hazard VARCHAR(50) NOT NULL, -- 'Flood', 'Cyclone', 'Heatwave', 'Landslide'
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Green', 'Yellow', 'Orange', 'Red')),
    urgency VARCHAR(20) DEFAULT 'Expected',
    headline TEXT NOT NULL,
    description JSONB NOT NULL, -- Multilingual {"en": "...", "te": "...", "ta": "...", "ml": "..."}
    instruction JSONB,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    radius_km INTEGER DEFAULT 25,
    is_active BOOLEAN DEFAULT TRUE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    raw_payload JSONB
);

-- 2. Weather Cache Table
CREATE TABLE IF NOT EXISTS weather_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(50) NOT NULL,
    temp_c DECIMAL(4, 1),
    feels_like_c DECIMAL(4, 1),
    rainfall_mm DECIMAL(6, 2) DEFAULT 0.0,
    wind_kmph DECIMAL(5, 2) DEFAULT 0.0,
    humidity INTEGER,
    weather_condition VARCHAR(100),
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Emergency Helplines Directory
CREATE TABLE IF NOT EXISTS helplines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state VARCHAR(50) NOT NULL,
    district VARCHAR(100) DEFAULT 'Statewide',
    category VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Push & Telegram Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('WebPush', 'Telegram')),
    endpoint_or_chatid TEXT NOT NULL UNIQUE,
    subscribed_states TEXT[] DEFAULT ARRAY['Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala'],
    min_severity VARCHAR(20) DEFAULT 'Orange',
    preferred_language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crowdsourced Citizen SOS Reports
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_name VARCHAR(100),
    phone_number VARCHAR(50),
    state VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(30) DEFAULT 'PENDING_VERIFICATION',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Ingestion Audit Logs
CREATE TABLE IF NOT EXISTS ingestion_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    items_ingested INTEGER DEFAULT 0,
    error_message TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Essential Emergency Helplines
INSERT INTO helplines (state, district, category, name, phone_number) VALUES
('Telangana', 'Statewide', 'Control Room', 'Telangana State Disaster Response Control Room', '1070'),
('Telangana', 'Hyderabad', 'Control Room', 'GHMC Emergency Control Room', '040-21111111'),
('Andhra Pradesh', 'Statewide', 'Control Room', 'AP State Emergency Operations Centre', '1070'),
('Andhra Pradesh', 'Visakhapatnam', 'Control Room', 'GVMC Disaster Cell', '0891-2869100'),
('Tamil Nadu', 'Statewide', 'Control Room', 'TN State Disaster Management Authority', '1070'),
('Tamil Nadu', 'Chennai', 'Control Room', 'GCC Flood Control Room', '1913'),
('Kerala', 'Statewide', 'Control Room', 'Kerala State Emergency Operations Centre', '1077'),
('Kerala', 'Wayanad', 'Control Room', 'Wayanad District Collectorate Emergency Ops', '04936-204151')
ON CONFLICT DO NOTHING;
