-- Database: scholar_match_db
-- Schema for the ScholarMatch AI Portal

-- 1. Users Table (Stores UAP Data)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    dob DATE,
    academic_level VARCHAR(50), -- Undergraduate, Postgraduate, 10+2
    field_of_study VARCHAR(100),
    residence_state VARCHAR(50), -- Domicile State (Crucial for filtering)
    target_state_study VARCHAR(50),
    annual_income_lpa DECIMAL(10, 2), -- Annual Income in Lakhs Per Annum
    is_first_gen BOOLEAN DEFAULT FALSE,
    is_scst BOOLEAN DEFAULT FALSE,
    is_pwd BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Scholarships Table (The master list of schemes)
CREATE TABLE scholarships (
    scheme_id SERIAL PRIMARY KEY,
    scheme_name VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE,
    required_level VARCHAR(50),
    required_field_tag TEXT[], -- e.g., {'Engineering', 'Science'}
    required_domicile TEXT[], -- e.g., {'Maharashtra', 'Pan-India'}
    max_income_lpa DECIMAL(10, 2),
    is_target_scst BOOLEAN DEFAULT FALSE,
    is_target_pwd BOOLEAN DEFAULT FALSE,
    apply_url VARCHAR(255)
);

-- Example Insert: PM-YESAS Scholarship
INSERT INTO scholarships (
    scheme_name, description, deadline, required_level, required_field_tag,
    required_domicile, max_income_lpa, is_target_scst, apply_url
) VALUES (
    'PM-YESAS Scholarship (Central Govt.)',
    'A central scheme for meritorious students in Science and Technology fields.',
    '2025-10-31',
    'Undergraduate',
    ARRAY['Science', 'Technology', 'Engineering'],
    ARRAY['Pan-India'],
    8.00, -- 8 Lakhs PA
    FALSE,
    'https://example.gov.in/pm-yesas'
);