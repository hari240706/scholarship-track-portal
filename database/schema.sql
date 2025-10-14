-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash TEXT,
  state VARCHAR(50),
  category VARCHAR(50),
  academic_level VARCHAR(50),
  field_of_study VARCHAR(100)
);

-- Scholarships table
CREATE TABLE scholarships (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  eligibility_criteria JSONB,
  required_documents TEXT[],
  state_filter VARCHAR(50),
  category_filter VARCHAR(50)
);

-- Matches table
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  scholarship_id INTEGER REFERENCES scholarships(id),
  confidence_score INTEGER,
  gap_analysis TEXT[]
);

-- Documents table
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255),
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
