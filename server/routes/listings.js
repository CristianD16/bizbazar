const express = require('express');
const router = express.Router();
const listings = require('../data/listings.json');

// GET /api/listings - Get all listings with optional filters
router.get('/', (req, res) => {
  let results = [...listings];

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
    page = 1,
    limit = 12,
    featured
  } = req.query;

  // Text search across title, description, and tags
  if (search) {
    const searchLower = search.toLowerCase();
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(searchLower) ||
        l.description.toLowerCase().includes(searchLower) ||
        l.tags.some((t) => t.includes(searchLower))
    );
  }

  // Filter by business type
  if (type) {
    const types = type.split(',');
    results = results.filter((l) => types.includes(l.type));
  }

  // Filter by category
  if (category) {
    results = results.filter((l) => l.category === category);
  }

  // Filter by country
  if (country) {
    results = results.filter(
      (l) => l.location.country.toLowerCase() === country.toLowerCase()
    );
  }

  // Filter by city
  if (city) {
    results = results.filter(
      (l) => l.location.city.toLowerCase() === city.toLowerCase()
    );
  }

  // Filter by price range
  if (minPrice) {
    results = results.filter((l) => l.askingPrice >= Number(minPrice));
  }
  if (maxPrice) {
    results = results.filter((l) => l.askingPrice <= Number(maxPrice));
  }

  // Filter featured only
  if (featured === 'true') {
    results = results.filter((l) => l.featured);
  }

  // Sorting
  if (sortBy) {
    results.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'price':
          valA = a.askingPrice;
          valB = b.askingPrice;
          break;
        case 'date':
          valA = new Date(a.createdAt);
          valB = new Date(b.createdAt);
          break;
        case 'revenue':
          valA = a.monthlyRevenue;
          valB = b.monthlyRevenue;
          break;
        default:
          return 0;
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedResults = results.slice(startIndex, endIndex);

  res.json({
    data: paginatedResults,
    pagination: {
      total: results.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(results.length / Number(limit))
    }
  });
});

// GET /api/listings/categories - Get all unique categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(listings.map((l) => l.category))];
  res.json(categories);
});

// GET /api/listings/locations - Get all unique locations
router.get('/locations', (req, res) => {
  const countries = [...new Set(listings.map((l) => l.location.country))];
  const cities = [...new Set(listings.map((l) => l.location.city))];
  res.json({ countries, cities });
});

// GET /api/listings/:id - Get a single listing
router.get('/:id', (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json(listing);
});

module.exports = router;
