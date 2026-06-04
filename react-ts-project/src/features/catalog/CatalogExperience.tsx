import { useState } from 'react'
import {
  AVAILABILITY_LABELS,
  AVAILABILITY_OPTIONS,
  BRANDS,
  COLOR_OPTIONS,
  SORT_OPTIONS,
  STORAGE_OPTIONS,
} from './catalog.constants'
import './catalog.css'
import { formatCurrency, isProductPurchasable } from './catalog.utils'
import { useCatalog } from './useCatalog'
import type { CatalogProduct, CatalogRole, CatalogService } from './catalog.types'

interface CatalogExperienceProps {
  role?: CatalogRole
  service?: CatalogService
}

export function CatalogExperience({
  role = 'customer',
  service,
}: CatalogExperienceProps) {
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const {
    applyFilters,
    clearFilters,
    errorMessage,
    filtersDraft,
    hasAccess,
    maxPrice,
    products,
    retry,
    role: activeRole,
    searchDraft,
    searchLimits,
    selectProduct,
    selectedProduct,
    setSearchDraft,
    showCatalogResults,
    sortBy,
    status,
    updateSort,
    updateAvailability,
    updateBrand,
    updateColor,
    updatePrice,
    updateStorage,
    validationMessage,
  } = useCatalog({ role, service })

  const viewProduct = (product: CatalogProduct) => {
    setSelectedStorage(product.storageOptions[0] ?? null)
    setSelectedColor(product.colorOptions[0] ?? null)
    selectProduct(product.id)
  }

  if (!hasAccess) {
    return (
      <section className="catalog-page permission-page" aria-labelledby="permission-title">
        <div className="top-banner">
          <span className="eyebrow">Agent Commerce Platform (ACP)</span>
          <h1 id="permission-title">VIP Bidder catalog</h1>
          <p>This experience is only available to customers and sales agents.</p>
          <div className="status-panel status-panel--warning">
            <strong>Permission denied</strong>
            <span>Allowed navigation: customer storefront or agent sales portal.</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="catalog-page" aria-labelledby="catalog-title">
      <header className="catalog-shell-header">
        <div>
          <span className="eyebrow">Agent Commerce Platform (ACP)</span>
          <h1 id="catalog-title">VIP Bidder catalog</h1>
          <p className="shell-copy">
            Browse eligible premium devices, apply search and filter rules, then continue into a
            product detail experience without losing your catalog context.
          </p>
        </div>
        <div className="header-badges" aria-label="Catalog session details">
          <span className="header-badge">Platform: E-Commerce</span>
          <span className="header-badge">Role: {activeRole === 'sales-agent' ? 'Sales Agent' : 'Customer'}</span>
          <span className="header-badge">Version 1.0</span>
        </div>
      </header>

      {selectedProduct ? (
        <ProductDetailView
          onBack={showCatalogResults}
          product={selectedProduct}
          selectedColor={selectedColor}
          selectedStorage={selectedStorage}
          setSelectedColor={setSelectedColor}
          setSelectedStorage={setSelectedStorage}
        />
      ) : (
        <div className="catalog-layout">
          <aside className="catalog-panel filter-panel" aria-labelledby="filters-title">
            <div className="panel-heading">
              <h2 id="filters-title">Filters</h2>
              <button type="button" className="ghost-button" onClick={clearFilters}>
                Clear all
              </button>
            </div>

            <label className="field-group" htmlFor="search-products">
              <span className="field-label">Search products</span>
              <input
                id="search-products"
                className="field-input"
                type="search"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder={`Use ${searchLimits.min}-${searchLimits.max} characters`}
              />
            </label>

            <section className="field-group" aria-labelledby="brand-filter-title">
              <span id="brand-filter-title" className="field-label">Brand</span>
              <div className="checkbox-group">
                {BRANDS.map((brand) => (
                  <label key={brand} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={filtersDraft.brands.includes(brand)}
                      onChange={(event) => updateBrand(brand, event.target.checked)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="field-group" aria-labelledby="price-filter-title">
              <span id="price-filter-title" className="field-label">
                Price up to <strong>{formatCurrency(filtersDraft.maxPrice)}</strong>
              </span>
              <input
                className="range-input"
                type="range"
                min="600"
                max={maxPrice}
                step="50"
                value={filtersDraft.maxPrice}
                onChange={(event) => updatePrice(Number(event.target.value))}
              />
            </section>

            <section className="field-group" aria-labelledby="storage-filter-title">
              <span id="storage-filter-title" className="field-label">Storage</span>
              <div className="chip-grid">
                {STORAGE_OPTIONS.map((storage) => (
                  <button
                    key={storage}
                    type="button"
                    className={filtersDraft.storages.includes(storage) ? 'chip chip--active' : 'chip'}
                    onClick={() => updateStorage(storage)}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </section>

            <section className="field-group" aria-labelledby="color-filter-title">
              <span id="color-filter-title" className="field-label">Color</span>
              <div className="swatch-grid">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={filtersDraft.colors.includes(color) ? 'swatch swatch--active' : 'swatch'}
                    onClick={() => updateColor(color)}
                    aria-label={`Toggle ${color} color filter`}
                  >
                    <span className="swatch-dot" data-color={color} />
                    <span>{color}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="field-group" aria-labelledby="availability-filter-title">
              <span id="availability-filter-title" className="field-label">Availability</span>
              <div className="checkbox-group">
                {AVAILABILITY_OPTIONS.map((availability) => (
                  <label key={availability} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={filtersDraft.availability.includes(availability)}
                      onChange={(event) => updateAvailability(availability, event.target.checked)}
                    />
                    <span>{AVAILABILITY_LABELS[availability]}</span>
                  </label>
                ))}
              </div>
            </section>

            {validationMessage ? (
              <p className="inline-feedback inline-feedback--danger" role="alert">
                {validationMessage}
              </p>
            ) : null}

            <div className="panel-actions">
              <button type="button" className="primary-button" onClick={applyFilters}>
                Apply filters
              </button>
              <button type="button" className="secondary-button" onClick={clearFilters}>
                Reset filters
              </button>
            </div>
          </aside>

          <section className="catalog-panel catalog-content" aria-labelledby="results-title">
            <div className="results-toolbar">
              <div>
                <span className="eyebrow">Product listing page</span>
                <h2 id="results-title">Eligible devices for VIP Bidder</h2>
                <p className="panel-copy">
                  Product actions remain role-aware and catalog state persists when moving into a detail view.
                </p>
              </div>

              <label className="sort-control" htmlFor="sort-products">
                <span>Sort by</span>
                <select
                  id="sort-products"
                  className="field-select"
                  value={sortBy}
                  onChange={(event) => updateSort(event.target.value as typeof sortBy)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {status === 'loading' ? (
              <div className="status-panel status-panel--loading" aria-live="polite">
                <strong>Loading eligible products</strong>
                <span>Refreshing catalog, pricing, and inventory projections.</span>
              </div>
            ) : null}

            {status === 'error' ? (
              <div className="status-panel status-panel--danger" role="alert">
                <strong>Catalog API is unavailable</strong>
                <span>{errorMessage ?? 'Please retry to continue.'}</span>
                <button type="button" className="primary-button" onClick={retry}>
                  Retry catalog load
                </button>
              </div>
            ) : null}

            {status === 'empty' ? (
              <div className="status-panel status-panel--empty">
                <strong>No products matched the current criteria</strong>
                <span>Reset or refine your filters to continue browsing eligible products.</span>
                <button type="button" className="secondary-button" onClick={clearFilters}>
                  Reset filters
                </button>
              </div>
            ) : null}

            {status === 'success' ? (
              <>
                <div className="results-summary">
                  <span>{products.length} products available</span>
                  <span>Availability is refreshed from the latest inventory projection.</span>
                </div>
                <div className="product-grid">
                  {products.map((product) => {
                    const isPurchasable = isProductPurchasable(product)

                    return (
                      <article key={product.id} className="product-card">
                        <div className="product-visual" style={{ background: product.heroGradient }}>
                          <span className="device-glow" />
                          <span className="device-frame" />
                        </div>
                        <div className="product-copy">
                          <div className="product-topline">
                            <span className="brand-pill">{product.brand}</span>
                            <span className={`stock-pill stock-pill--${product.availability}`}>
                              {AVAILABILITY_LABELS[product.availability]}
                            </span>
                          </div>
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <div className="price-row">
                            <strong>{formatCurrency(product.originalPrice)}</strong>
                            <span>From ${product.monthlyPrice.toFixed(2)}/mo</span>
                          </div>
                          <div className="meta-row">
                            <span>{product.rating.toFixed(1)} stars</span>
                            <span>{product.reviewCount} reviews</span>
                          </div>
                          <p className="badge-note">{product.badge}</p>
                        </div>
                        <div className="product-actions">
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => viewProduct(product)}
                            aria-label={`View ${product.name}`}
                          >
                            View details
                          </button>
                          <button
                            type="button"
                            className="primary-button"
                            disabled={!isPurchasable}
                            aria-label={`Add ${product.name} to cart`}
                          >
                            {isPurchasable ? 'Add to cart' : 'Unavailable'}
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </>
            ) : null}
          </section>
        </div>
      )}
    </section>
  )
}

interface ProductDetailViewProps {
  onBack: () => void
  product: CatalogProduct
  selectedColor: string | null
  selectedStorage: string | null
  setSelectedColor: (color: string) => void
  setSelectedStorage: (storage: string) => void
}

function ProductDetailView({
  onBack,
  product,
  selectedColor,
  selectedStorage,
  setSelectedColor,
  setSelectedStorage,
}: ProductDetailViewProps) {
  const isPurchasable = isProductPurchasable(product)

  return (
    <section className="catalog-panel detail-shell" aria-labelledby="detail-title">
      <button type="button" className="ghost-button detail-back" onClick={onBack}>
        Back to catalog results
      </button>
      <div className="detail-layout">
        <div className="detail-showcase">
          <div className="detail-visual" style={{ background: product.heroGradient }}>
            <span className="device-glow device-glow--large" />
            <span className="device-frame device-frame--large" />
          </div>
          <div className="thumbnail-row" aria-label="Product gallery thumbnails">
            {product.colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                className={selectedColor === color ? 'thumbnail thumbnail--active' : 'thumbnail'}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color}`}
              >
                <span className="swatch-dot" data-color={color} />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-copy-panel">
          <span className="eyebrow">Product detail page</span>
          <h2 id="detail-title">{product.name}</h2>
          <p className="panel-copy">{product.description}</p>

          <div className="detail-pricing">
            <strong>From ${product.monthlyPrice.toFixed(2)}/mo</strong>
            <span>{formatCurrency(product.originalPrice)} full retail</span>
          </div>

          <section className="detail-section" aria-labelledby="detail-colors-title">
            <h3 id="detail-colors-title">Select color</h3>
            <div className="swatch-grid">
              {product.colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={selectedColor === color ? 'swatch swatch--active' : 'swatch'}
                  onClick={() => setSelectedColor(color)}
                >
                  <span className="swatch-dot" data-color={color} />
                  <span>{color}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="detail-section" aria-labelledby="detail-storage-title">
            <h3 id="detail-storage-title">Select storage</h3>
            <div className="chip-grid">
              {product.storageOptions.map((storage) => (
                <button
                  key={storage}
                  type="button"
                  className={selectedStorage === storage ? 'chip chip--active' : 'chip'}
                  onClick={() => setSelectedStorage(storage)}
                >
                  {storage}
                </button>
              ))}
            </div>
          </section>

          <div className="purchase-card">
            <span className={`stock-pill stock-pill--${product.availability}`}>
              {AVAILABILITY_LABELS[product.availability]}
            </span>
            <p>{product.supportNote}</p>
            <p className="badge-note">{product.badge}</p>
            <div className="product-actions">
              <button type="button" className="primary-button" disabled={!isPurchasable}>
                {isPurchasable ? 'Add to cart' : 'Unavailable'}
              </button>
              <button type="button" className="secondary-button">
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
