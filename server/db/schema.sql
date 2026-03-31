-- BizBazar PostgreSQL Schema

-- Business type enum
CREATE TYPE business_type AS ENUM ('sme', 'ecommerce', 'franchise');

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Countries
CREATE TABLE IF NOT EXISTS countries (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Locations (city + region + country)
CREATE TABLE IF NOT EXISTS locations (
  id         SERIAL PRIMARY KEY,
  city       VARCHAR(100) NOT NULL,
  region     VARCHAR(100),
  country_id INTEGER NOT NULL REFERENCES countries(id),
  UNIQUE (city, region, country_id)
);

-- Sellers (can evolve into a full users table)
CREATE TABLE IF NOT EXISTS sellers (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  verified   BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Listings
CREATE TABLE IF NOT EXISTS listings (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(300) NOT NULL,
  type             business_type NOT NULL,
  category_id      INTEGER NOT NULL REFERENCES categories(id),
  description      TEXT,
  asking_price     BIGINT NOT NULL,
  currency         VARCHAR(10) NOT NULL DEFAULT 'CLP',
  monthly_revenue  BIGINT,
  monthly_profit   BIGINT,
  employees        INTEGER,
  year_established INTEGER,
  location_id      INTEGER NOT NULL REFERENCES locations(id),
  seller_id        INTEGER NOT NULL REFERENCES sellers(id),
  featured         BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Listing ↔ Tags (many-to-many)
CREATE TABLE IF NOT EXISTS listing_tags (
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (listing_id, tag_id)
);

-- Listing images
CREATE TABLE IF NOT EXISTS listing_images (
  id         SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_listings_type        ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_category    ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_location    ON listings(location_id);
CREATE INDEX IF NOT EXISTS idx_listings_seller      ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_featured    ON listings(featured);
CREATE INDEX IF NOT EXISTS idx_listings_asking_price ON listings(asking_price);
CREATE INDEX IF NOT EXISTS idx_listings_created_at  ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_listing_tags_listing ON listing_tags(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_tags_tag     ON listing_tags(tag_id);
