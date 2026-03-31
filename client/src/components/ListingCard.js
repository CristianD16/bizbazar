import React from 'react';
import { Link } from 'react-router-dom';
import { formatCLP, getTypeLabel, getTypeColor } from '../utils/api';

function ListingCard({ listing }) {
  return (
    <Link to={`/listing/${listing.id}`} className="listing-card">
      <div className="listing-card-image">
        <div className="listing-card-placeholder">
          {listing.type === 'sme' && '🏪'}
          {listing.type === 'ecommerce' && '🛒'}
          {listing.type === 'franchise' && '🏷️'}
        </div>
        <span
          className="listing-type-badge"
          style={{ backgroundColor: getTypeColor(listing.type) }}
        >
          {getTypeLabel(listing.type)}
        </span>
        {listing.featured && (
          <span className="listing-featured-badge">Destacado</span>
        )}
      </div>

      <div className="listing-card-content">
        <h3 className="listing-card-title">{listing.title}</h3>
        <p className="listing-card-location">
          📍 {listing.location.city}, {listing.location.country}
        </p>

        <div className="listing-card-price">
          <span className="price-label">Precio</span>
          <span className="price-value">{formatCLP(listing.askingPrice)}</span>
        </div>

        <div className="listing-card-stats">
          <div className="stat">
            <span className="stat-label">Ingreso mensual</span>
            <span className="stat-value">{formatCLP(listing.monthlyRevenue)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Utilidad mensual</span>
            <span className="stat-value">{formatCLP(listing.monthlyProfit)}</span>
          </div>
        </div>

        <div className="listing-card-meta">
          <span>🏢 {listing.employees} empleados</span>
          <span>📅 Desde {listing.yearEstablished}</span>
          {listing.seller.verified && <span className="verified">✓ Verificado</span>}
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;
