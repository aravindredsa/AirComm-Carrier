import { startTransition, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  MAX_PRICE,
  SEARCH_TERM_LIMITS,
  SUPPORTED_ROLES,
} from './catalog.constants'
import { catalogService } from './catalog.service'
import { validateFilters, validateSearchTerm } from './catalog.utils'
import type {
  CatalogFilters,
  CatalogProduct,
  CatalogRole,
  CatalogService,
  SortOption,
} from './catalog.types'

interface UseCatalogOptions {
  role: CatalogRole
  service?: CatalogService
}

export function useCatalog({ role, service = catalogService }: UseCatalogOptions) {
  const [searchDraft, setSearchDraft] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtersDraft, setFiltersDraft] = useState<CatalogFilters>(DEFAULT_FILTERS)
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT)
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const hasAccess = SUPPORTED_ROLES.includes(role)

  useEffect(() => {
    if (!hasAccess) {
      return
    }

    const controller = new AbortController()

    service
      .searchProducts({
        searchTerm,
        filters,
        sortBy,
        signal: controller.signal,
      })
      .then((result) => {
        setProducts(result.products)
        setStatus(result.total > 0 ? 'success' : 'empty')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setProducts([])
        setStatus('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Catalog API is unavailable. Please retry to continue.',
        )
      })

    return () => controller.abort()
  }, [filters, hasAccess, reloadKey, searchTerm, service, sortBy])

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? null,
    [products, selectedProductId],
  )

  function applyFilters() {
    const searchError = validateSearchTerm(searchDraft)
    if (searchError) {
      setValidationMessage(searchError)
      return
    }

    const filterError = validateFilters(filtersDraft)
    if (filterError) {
      setValidationMessage(filterError)
      return
    }

    setValidationMessage(null)
    setErrorMessage(null)
    setStatus('loading')
    startTransition(() => {
      setSearchTerm(searchDraft.trim())
      setFilters(filtersDraft)
      setSelectedProductId(null)
    })
  }

  function clearFilters() {
    setValidationMessage(null)
    setErrorMessage(null)
    setSearchDraft('')
    setSearchTerm('')
    setStatus('loading')
    setFiltersDraft(DEFAULT_FILTERS)
    setFilters(DEFAULT_FILTERS)
    setSortBy(DEFAULT_SORT)
    setSelectedProductId(null)
  }

  function retry() {
    setErrorMessage(null)
    setStatus('loading')
    setReloadKey((currentValue) => currentValue + 1)
  }

  function updateSort(nextSortBy: SortOption) {
    setErrorMessage(null)
    setStatus('loading')
    setSortBy(nextSortBy)
  }

  function updateBrand(brand: CatalogFilters['brands'][number], checked: boolean) {
    setFiltersDraft((currentFilters) => ({
      ...currentFilters,
      brands: checked
        ? [...currentFilters.brands, brand]
        : currentFilters.brands.filter((value) => value !== brand),
    }))
  }

  function updateStorage(storage: CatalogFilters['storages'][number]) {
    setFiltersDraft((currentFilters) => ({
      ...currentFilters,
      storages: currentFilters.storages.includes(storage)
        ? currentFilters.storages.filter((value) => value !== storage)
        : [...currentFilters.storages, storage],
    }))
  }

  function updateColor(color: string) {
    setFiltersDraft((currentFilters) => ({
      ...currentFilters,
      colors: currentFilters.colors.includes(color)
        ? currentFilters.colors.filter((value) => value !== color)
        : [...currentFilters.colors, color],
    }))
  }

  function updateAvailability(
    availability: CatalogFilters['availability'][number],
    checked: boolean,
  ) {
    setFiltersDraft((currentFilters) => ({
      ...currentFilters,
      availability: checked
        ? [...currentFilters.availability, availability]
        : currentFilters.availability.filter((value) => value !== availability),
    }))
  }

  return {
    errorMessage,
    filtersDraft,
    hasAccess,
    maxPrice: MAX_PRICE,
    products,
    role,
    searchDraft,
    searchLimits: SEARCH_TERM_LIMITS,
    selectedProduct,
    sortBy,
    status,
    validationMessage,
    applyFilters,
    clearFilters,
    retry,
    selectProduct: setSelectedProductId,
    setSearchDraft,
    updateSort,
    showCatalogResults: () => setSelectedProductId(null),
    updateAvailability,
    updateBrand,
    updateColor,
    updatePrice: (maxPriceValue: number) =>
      setFiltersDraft((currentFilters) => ({
        ...currentFilters,
        maxPrice: maxPriceValue,
      })),
    updateStorage,
  }
}
