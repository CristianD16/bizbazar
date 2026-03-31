# BizBazar LATAM

Marketplace para comprar y vender negocios (PYMEs, E-commerce y Franquicias) en Chile y Latinoamérica.

## Quick Start

```bash
# 1. Install all dependencies
npm run install-all

# 2. Start both backend and frontend
npm start
```

This will run:
- **Backend API** on http://localhost:5000
- **React Frontend** on http://localhost:3000

## Project Structure

```
bizbazar/
├── server/                  # Express.js backend
│   ├── index.js             # Server entry point
│   ├── routes/listings.js   # Listings API endpoints
│   └── data/listings.json   # Sample listing data
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Page components (Home, Search, Detail)
│       ├── utils/           # API helpers & formatters
│       ├── App.js
│       └── index.css        # Global styles
└── package.json
```

## API Endpoints

- `GET /api/listings` — List all (with filters: search, type, category, country, minPrice, maxPrice, sortBy)
- `GET /api/listings/:id` — Single listing detail
- `GET /api/listings/categories` — All categories
- `GET /api/listings/locations` — All countries and cities

## Features (V1)

- Homepage with hero search, featured & recent listings
- Full search page with text search, type/category/country/price filters
- Sorting by date, price, or revenue
- Detailed listing view with financials, ROI calculation, seller contact
- Responsive design for mobile and desktop
- 12 sample listings across Chile, Argentina, Colombia, and Peru
