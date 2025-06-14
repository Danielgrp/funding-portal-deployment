
-- Drop tables if they exist (optional, for clean setup)
DROP TABLE IF EXISTS opportunity_tags CASCADE;
DROP TABLE IF EXISTS funding_opportunities CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS research_areas CASCADE;
-- DROP TABLE IF EXISTS users CASCADE; -- If users table is added
-- DROP TABLE IF EXISTS user_saved_opportunities CASCADE; -- If user saved opps table is added

-- Organizations table
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(100),
  website VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- Research areas table
CREATE TABLE research_areas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

-- Tags table for flexible categorization
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Funding opportunities table
CREATE TABLE funding_opportunities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  country VARCHAR(100),
  amount_min INTEGER,
  amount_max INTEGER,
  currency VARCHAR(10) DEFAULT 'USD',
  deadline DATE,
  research_area_id INTEGER REFERENCES research_areas(id) ON DELETE SET NULL,
  description TEXT,
  eligibility_criteria TEXT,
  application_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active', -- e.g., active, closed, upcoming
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- Many-to-many relationship for opportunity tags
CREATE TABLE opportunity_tags (
  opportunity_id INTEGER NOT NULL REFERENCES funding_opportunities(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (opportunity_id, tag_id)
);

-- Indexes for performance
CREATE INDEX idx_funding_opportunities_deadline ON funding_opportunities(deadline);
CREATE INDEX idx_funding_opportunities_status ON funding_opportunities(status);
CREATE INDEX idx_funding_opportunities_organization_id ON funding_opportunities(organization_id);
CREATE INDEX idx_funding_opportunities_research_area_id ON funding_opportunities(research_area_id);
CREATE INDEX idx_tags_name ON tags(name);

-- Optional: Function to update 'updated_at' timestamp automatically
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW() AT TIME ZONE 'utc';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_funding_opportunities
BEFORE UPDATE ON funding_opportunities
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Sample Data Insertion (Illustrative - use populate_db_with_sample_data in backend for actual population)
-- INSERT INTO organizations (name, country) VALUES ('National Science Foundation', 'United States');
-- INSERT INTO research_areas (name) VALUES ('Computer Science');
-- INSERT INTO tags (name) VALUES ('Early Career');
-- INSERT INTO funding_opportunities (title, organization_id, description, deadline) VALUES 
--   ('Sample Grant', (SELECT id from organizations WHERE name='National Science Foundation'), 'A sample grant description.', '2025-12-31');

COMMENT ON COLUMN funding_opportunities.status IS 'Possible values: active, closed, upcoming, draft';
