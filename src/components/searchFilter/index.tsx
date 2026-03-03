import React, { useState } from 'react';
import './index.css';
import useDebounce from '../../hooks/useDebounce';

const title = 'Product Search Filter';

// Sample product data for showcase
const SAMPLE_PRODUCTS = [
  'Laptop Pro 15',
  'Wireless Mouse',
  'USB-C Cable',
  'Mechanical Keyboard',
  'Monitor 4K',
  'Laptop Stand',
  'Webcam HD',
  'Headphones Pro',
  'Phone Case',
  'Phone Screen Protector',
  'Laptop Cooling Pad',
  'USB Hub 7-in-1',
  'Portable SSD 1TB',
  'Laptop Backpack',
  'Phone Battery Pack',
];

function SearchFilter() {
  const [searchInput, setSearchInput] = useState<string>('');

  // Use the debounce hook with 500ms delay
  const debouncedSearchValue = useDebounce<string>(searchInput, 500);

  // Filter products based on debounced search value
  const filteredProducts = SAMPLE_PRODUCTS.filter((product) =>
    product.toLowerCase().includes(debouncedSearchValue.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <section className="layout-column search-filter-container">
      <p className="search-filter-title">{title}</p>

      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchInput}
          onChange={handleSearchChange}
          data-testid="search-input"
        />
      </div>

      <div className="products-info">
        <span data-testid="results-count">
          Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="products-list" data-testid="products-list">
        {filteredProducts.length > 0 ? (
          <ul>
            {filteredProducts.map((product, index) => (
              <li key={index} data-testid={`product-item-${index}`}>
                {product}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">No products found matching "{debouncedSearchValue}"</p>
        )}
      </div>
    </section>
  );
}

export default SearchFilter;

