import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { fetchListings } from '../utils/api';

function HomePage() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [featured, recent] = await Promise.all([
          fetchListings({ featured: 'true', limit: 4 }),
          fetchListings({ sortBy: 'date', sortOrder: 'desc', limit: 4 })
        ]);
        setFeaturedListings(featured.data);
        setRecentListings(recent.data);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    { value: '500+', label: 'Negocios Listados' },
    { value: '12', label: 'Países LATAM' },
    { value: '$2B+', label: 'En Transacciones' },
    { value: '98%', label: 'Satisfacción' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Compra y Vende Negocios<br />
            en <span className="highlight">Latinoamérica</span>
          </h1>
          <p className="hero-subtitle">
            El marketplace más grande para PYMEs, e-commerce y franquicias en Chile y la región.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar por tipo de negocio, ubicación o palabra clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-btn">
              Buscar Negocios
            </button>
          </form>

          <div className="hero-quick-links">
            <button onClick={() => navigate('/search?type=sme')}>🏪 PYMEs</button>
            <button onClick={() => navigate('/search?type=ecommerce')}>🛒 E-commerce</button>
            <button onClick={() => navigate('/search?type=franchise')}>🏷️ Franquicias</button>
            <button onClick={() => navigate('/search?country=Chile')}>🇨🇱 Chile</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="listings-section">
        <div className="section-header">
          <h2>Negocios Destacados</h2>
          <button
            className="see-all-btn"
            onClick={() => navigate('/search?featured=true')}
          >
            Ver todos →
          </button>
        </div>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <div className="listings-grid">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Listings */}
      <section className="listings-section">
        <div className="section-header">
          <h2>Publicados Recientemente</h2>
          <button
            className="see-all-btn"
            onClick={() => navigate('/search')}
          >
            Ver todos →
          </button>
        </div>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <div className="listings-grid">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>¿Quieres vender tu negocio?</h2>
        <p>Publica tu negocio y llega a miles de compradores potenciales en toda Latinoamérica.</p>
        <button className="cta-btn">Publicar mi Negocio</button>
      </section>
    </div>
  );
}

export default HomePage;
