const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export async function fetchListings(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE}/listings?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch listings');
  return response.json();
}

export async function fetchListing(id) {
  const response = await fetch(`${API_BASE}/listings/${id}`);
  if (!response.ok) throw new Error('Listing not found');
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/listings/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function fetchLocations() {
  const response = await fetch(`${API_BASE}/listings/locations`);
  if (!response.ok) throw new Error('Failed to fetch locations');
  return response.json();
}

export function formatCLP(amount) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getTypeLabel(type) {
  const labels = {
    sme: 'PYME',
    ecommerce: 'E-commerce',
    franchise: 'Franquicia'
  };
  return labels[type] || type;
}

export function getTypeColor(type) {
  const colors = {
    sme: '#2563eb',
    ecommerce: '#7c3aed',
    franchise: '#059669'
  };
  return colors[type] || '#6b7280';
}
