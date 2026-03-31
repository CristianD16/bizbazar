import React, { useState, useEffect } from 'react';
import { fetchCategories, fetchLocations } from '../utils/api';

function SearchFilters({ filters, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState({ countries: [], cities: [] });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
    fetchLocations().then(setLocations).catch(console.error);
  }, []);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      type: '',
      category: '',
      country: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && v !== 'date' && v !== 'desc'
  ).length;

  return (
    <div className="search-filters">
      <div className="filters-header">
        <button
          className="filters-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
          <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
        </button>
        {activeFilterCount > 0 && (
          <button className="clear-filters" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      <div className={`filters-panel ${isOpen ? 'open' : ''}`}>
        <div className="filter-group">
          <label>Tipo de Negocio</label>
          <div className="filter-chips">
            {[
              { value: '', label: 'Todos' },
              { value: 'sme', label: 'PYMEs' },
              { value: 'ecommerce', label: 'E-commerce' },
              { value: 'franchise', label: 'Franquicias' }
            ].map((option) => (
              <button
                key={option.value}
                className={`filter-chip ${filters.type === option.value ? 'active' : ''}`}
                onClick={() => handleChange('type', option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Categoría</label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>País</label>
          <select
            value={filters.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
          >
            <option value="">Todos los países</option>
            {locations.countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Rango de Precio (CLP)</label>
          <div className="price-range">
            <input
              type="number"
              placeholder="Mínimo"
              value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Máximo"
              value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Ordenar por</label>
          <div className="sort-controls">
            <select
              value={filters.sortBy || 'date'}
              onChange={(e) => handleChange('sortBy', e.target.value)}
            >
              <option value="date">Fecha</option>
              <option value="price">Precio</option>
              <option value="revenue">Ingresos</option>
            </select>
            <button
              className={`sort-order ${filters.sortOrder === 'asc' ? 'asc' : ''}`}
              onClick={() =>
                handleChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')
              }
            >
              {filters.sortOrder === 'asc' ? '↑ Ascendente' : '↓ Descendente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFilters;
