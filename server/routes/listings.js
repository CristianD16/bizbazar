const express = require('express');
const router  = express.Router();
const db      = require('../db');

// Maps a DB row to the API response shape (keeps the same contract as before)
function formatListing(row) {
  return {
    id:              String(row.id),
    title:           row.title,
    type:            row.type,
    category:        row.category,
    description:     row.description,
    askingPrice:     Number(row.asking_price),
    currency:        row.currency,
    monthlyRevenue:  Number(row.monthly_revenue),
    monthlyProfit:   Number(row.monthly_profit),
    employees:       row.employees,
    yearEstablished: row.year_established,
    location: {
      city:    row.city,
      region:  row.region,
      country: row.country,
    },
    images:  row.images ? row.images.filter(Boolean) : [],
    seller: {
      name:     row.seller_name,
      verified: row.seller_verified,
    },
    tags:      row.tags ? row.tags.filter(Boolean) : [],
    featured:  row.featured,
    createdAt: row.created_at,
  };
}

// Base SELECT used by both the list and detail queries
const BASE_SELECT = `
  SELECT
    l.id, l.title, l.type, l.description,
    l.asking_price, l.currency,
    l.monthly_revenue, l.monthly_profit,
    l.employees, l.year_established,
    l.featured, l.created_at,
    c.name  AS category,
    loc.city, loc.region,
    co.name AS country,
    s.name     AS seller_name,
    s.verified AS seller_verified,
    ARRAY_AGG(DISTINCT t.name)   FILTER (WHERE t.name   IS NOT NULL) AS tags,
    ARRAY_AGG(DISTINCT img.url ORDER BY img.position)
                                 FILTER (WHERE img.url   IS NOT NULL) AS images
  FROM listings l
  JOIN categories c   ON l.category_id  = c.id
  JOIN locations  loc ON l.location_id  = loc.id
  JOIN countries  co  ON loc.country_id = co.id
  JOIN sellers    s   ON l.seller_id    = s.id
  LEFT JOIN listing_tags   lt  ON l.id = lt.listing_id
  LEFT JOIN tags           t   ON lt.tag_id  = t.id
  LEFT JOIN listing_images img ON l.id = img.listing_id
`;

// GET /api/listings
router.get('/', async (req, res) => {
  try {
    const {
      search,
      type,
      category,
      country,
      city,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page  = 1,
      limit = 12,
      featured,
    } = req.query;

    const params     = [];
    const conditions = [];
    let   idx        = 1;

    if (search) {
      conditions.push(`(
        l.title       ILIKE $${idx} OR
        l.description ILIKE $${idx} OR
        EXISTS (
          SELECT 1 FROM listing_tags lt2
          JOIN tags t2 ON lt2.tag_id = t2.id
          WHERE lt2.listing_id = l.id AND t2.name ILIKE $${idx}
        )
      )`);
      params.push(`%${search}%`);
      idx++;
    }

    if (type) {
      // accepts comma-separated values: ?type=sme,franchise
      const types = type.split(',');
      conditions.push(`l.type = ANY($${idx}::business_type[])`);
      params.push(types);
      idx++;
    }

    if (category) {
      conditions.push(`c.name = $${idx}`);
      params.push(category);
      idx++;
    }

    if (country) {
      conditions.push(`LOWER(co.name) = LOWER($${idx})`);
      params.push(country);
      idx++;
    }

    if (city) {
      conditions.push(`LOWER(loc.city) = LOWER($${idx})`);
      params.push(city);
      idx++;
    }

    if (minPrice) {
      conditions.push(`l.asking_price >= $${idx}`);
      params.push(Number(minPrice));
      idx++;
    }

    if (maxPrice) {
      conditions.push(`l.asking_price <= $${idx}`);
      params.push(Number(maxPrice));
      idx++;
    }

    if (featured === 'true') {
      conditions.push('l.featured = true');
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const sortMap = {
      price:   'l.asking_price',
      date:    'l.created_at',
      revenue: 'l.monthly_revenue',
    };
    const orderCol = sortMap[sortBy] || 'l.created_at';
    const orderDir = sortOrder === 'asc' ? 'ASC' : 'DESC';

    // Count distinct listings matching the filters
    const countSQL = `
      SELECT COUNT(DISTINCT l.id) AS total
      FROM listings l
      JOIN categories c   ON l.category_id  = c.id
      JOIN locations  loc ON l.location_id  = loc.id
      JOIN countries  co  ON loc.country_id = co.id
      ${where}
    `;

    const offset  = (Number(page) - 1) * Number(limit);
    const dataSQL = `
      ${BASE_SELECT}
      ${where}
      GROUP BY l.id, c.name, loc.city, loc.region, co.name, s.name, s.verified
      ORDER BY ${orderCol} ${orderDir}
      LIMIT $${idx} OFFSET $${idx + 1}
    `;

    const [countResult, dataResult] = await Promise.all([
      db.query(countSQL, params),
      db.query(dataSQL,  [...params, Number(limit), offset]),
    ]);

    const total = Number(countResult.rows[0].total);

    res.json({
      data: dataResult.rows.map(formatListing),
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/listings/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT name FROM categories ORDER BY name');
    res.json(result.rows.map((r) => r.name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/listings/locations
router.get('/locations', async (req, res) => {
  try {
    const [countries, cities] = await Promise.all([
      db.query(`
        SELECT DISTINCT co.name
        FROM countries co
        JOIN locations loc ON loc.country_id = co.id
        ORDER BY co.name
      `),
      db.query('SELECT DISTINCT city FROM locations ORDER BY city'),
    ]);
    res.json({
      countries: countries.rows.map((r) => r.name),
      cities:    cities.rows.map((r) => r.city),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      ${BASE_SELECT}
      WHERE l.id = $1
      GROUP BY l.id, c.name, loc.city, loc.region, co.name, s.name, s.verified
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(formatListing(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
