import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');
    if (search) {
      navigate(`/search?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🏢</span>
          <span className="logo-text">BizBazar</span>
          <span className="logo-tagline">LATAM</span>
        </Link>

        <form className="header-search" onSubmit={handleQuickSearch}>
          <input
            type="text"
            name="search"
            placeholder="Buscar negocios..."
            className="header-search-input"
          />
          <button type="submit" className="header-search-btn">
            🔍
          </button>
        </form>

        <nav className="header-nav">
          <Link to="/search" className="nav-link">Explorar</Link>
          <Link to="/search?type=sme" className="nav-link">PYMEs</Link>
          <Link to="/search?type=ecommerce" className="nav-link">E-commerce</Link>
          <Link to="/search?type=franchise" className="nav-link">Franquicias</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
