import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import SearchFilters from '../components/SearchFilters';
import { fetchListings } from '../utils/api';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    country: searchParams.get('country') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'date',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      const result = await fetchListings(params);
      setListings(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error loading listings:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'date' && value !== 'desc') {
        params.set(key, value);
      }
    });
    if (page > 1) params.set('page', page);
    setSearchParams(params, { replace: true });
  }, [filters, page, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleFilterChange({ ...filters, search: formData.get('search') });
  };

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1>Explorar Negocios</h1>
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="search"
            defaultValue={filters.search}
            placeholder="Buscar negocios por nombre, categoría o ubicación..."
            className="search-input"
          />
          <button type="submit" className="search-btn">Buscar</button>
        </form>
      </div>

      <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="search-results-header">
        <p className="results-count">
          {pagination.total} negocio{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Buscando negocios...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="no-results">
          <h2>No se encontraron resultados</h2>
          <p>Intenta modificar los filtros o usar otros términos de búsqueda.</p>
        </div>
      ) : (
        <>
          <div className="listings-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="pagination-btn"
              >
                ← Anterior
              </button>
              <span className="pagination-info">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="pagination-btn"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchPage;
