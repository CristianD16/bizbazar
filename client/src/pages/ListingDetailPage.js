import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchListing, formatCLP, getTypeLabel, getTypeColor } from '../utils/api';

function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    async function loadListing() {
      try {
        const data = await fetchListing(id);
        setListing(data);
      } catch (err) {
        console.error('Error loading listing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando detalle...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="detail-page">
        <div className="not-found">
          <h2>Negocio no encontrado</h2>
          <Link to="/search">← Volver a la búsqueda</Link>
        </div>
      </div>
    );
  }

  const roi = listing.monthlyProfit > 0
    ? Math.round(listing.askingPrice / listing.monthlyProfit)
    : null;

  return (
    <div className="detail-page">
      <div className="detail-breadcrumb">
        <Link to="/">Inicio</Link> / <Link to="/search">Explorar</Link> / {listing.title}
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          {/* Image placeholder */}
          <div className="detail-image">
            <div className="detail-image-placeholder">
              {listing.type === 'sme' && '🏪'}
              {listing.type === 'ecommerce' && '🛒'}
              {listing.type === 'franchise' && '🏷️'}
            </div>
          </div>

          <div className="detail-header">
            <div className="detail-badges">
              <span
                className="listing-type-badge"
                style={{ backgroundColor: getTypeColor(listing.type) }}
              >
                {getTypeLabel(listing.type)}
              </span>
              <span className="detail-category">{listing.category}</span>
              {listing.featured && (
                <span className="listing-featured-badge">Destacado</span>
              )}
            </div>
            <h1>{listing.title}</h1>
            <p className="detail-location">
              📍 {listing.location.city}, {listing.location.region}, {listing.location.country}
            </p>
          </div>

          <div className="detail-description">
            <h2>Descripción del Negocio</h2>
            <p>{listing.description}</p>
          </div>

          <div className="detail-financials">
            <h2>Información Financiera</h2>
            <div className="financials-grid">
              <div className="financial-card">
                <span className="financial-label">Precio de Venta</span>
                <span className="financial-value highlight">{formatCLP(listing.askingPrice)}</span>
              </div>
              <div className="financial-card">
                <span className="financial-label">Ingresos Mensuales</span>
                <span className="financial-value">{formatCLP(listing.monthlyRevenue)}</span>
              </div>
              <div className="financial-card">
                <span className="financial-label">Utilidad Mensual</span>
                <span className="financial-value">{formatCLP(listing.monthlyProfit)}</span>
              </div>
              <div className="financial-card">
                <span className="financial-label">Ingresos Anuales (est.)</span>
                <span className="financial-value">{formatCLP(listing.monthlyRevenue * 12)}</span>
              </div>
              {roi && (
                <div className="financial-card">
                  <span className="financial-label">ROI Estimado</span>
                  <span className="financial-value">{roi} meses</span>
                </div>
              )}
              <div className="financial-card">
                <span className="financial-label">Margen de Utilidad</span>
                <span className="financial-value">
                  {Math.round((listing.monthlyProfit / listing.monthlyRevenue) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="detail-info">
            <h2>Detalles del Negocio</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Empleados</span>
                <span className="info-value">{listing.employees}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Año de Fundación</span>
                <span className="info-value">{listing.yearEstablished}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Antigüedad</span>
                <span className="info-value">{2026 - listing.yearEstablished} años</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ubicación</span>
                <span className="info-value">{listing.location.city}, {listing.location.country}</span>
              </div>
            </div>
          </div>

          {listing.tags.length > 0 && (
            <div className="detail-tags">
              {listing.tags.map((tag) => (
                <Link key={tag} to={`/search?search=${tag}`} className="tag">
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="sidebar-card price-card">
            <div className="sidebar-price">{formatCLP(listing.askingPrice)}</div>
            <button
              className="contact-btn"
              onClick={() => setShowContact(!showContact)}
            >
              {showContact ? 'Ocultar Contacto' : 'Contactar al Vendedor'}
            </button>

            {showContact && (
              <div className="contact-info">
                <p className="seller-name">
                  {listing.seller.name}
                  {listing.seller.verified && (
                    <span className="verified-badge"> ✓ Verificado</span>
                  )}
                </p>
                <button className="message-btn">Enviar Mensaje</button>
                <button className="phone-btn">Solicitar Teléfono</button>
              </div>
            )}
          </div>

          <div className="sidebar-card">
            <h3>Resumen Rápido</h3>
            <ul className="quick-summary">
              <li>
                <span>Tipo:</span>
                <strong>{getTypeLabel(listing.type)}</strong>
              </li>
              <li>
                <span>Categoría:</span>
                <strong>{listing.category}</strong>
              </li>
              <li>
                <span>Empleados:</span>
                <strong>{listing.employees}</strong>
              </li>
              <li>
                <span>Utilidad/mes:</span>
                <strong>{formatCLP(listing.monthlyProfit)}</strong>
              </li>
              {roi && (
                <li>
                  <span>ROI:</span>
                  <strong>{roi} meses</strong>
                </li>
              )}
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>¿Interesado?</h3>
            <p className="sidebar-help-text">
              Nuestro equipo puede ayudarte con el proceso de compra, incluyendo due diligence y financiamiento.
            </p>
            <button className="help-btn">Solicitar Asesoría</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailPage;
