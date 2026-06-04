import type {
  Availability,
  Brand,
  CatalogFilters,
  CatalogRole,
  SortOption,
  StorageOption,
} from './catalog.types'

export const SEARCH_TERM_LIMITS = {
  min: 2,
  max: 40,
} as const

export const SUPPORTED_ROLES: CatalogRole[] = ['customer', 'sales-agent']

export const BRANDS: Brand[] = ['Apple', 'Samsung', 'Google']

export const STORAGE_OPTIONS: StorageOption[] = ['128 GB', '256 GB', '512 GB', '1 TB']

export const AVAILABILITY_OPTIONS: Availability[] = [
  'in-stock',
  'low-stock',
  'preorder',
  'out-of-stock',
]

export const COLOR_OPTIONS = ['Graphite', 'Titanium', 'Ocean', 'Lilac', 'Hazel']

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'best-match', label: 'Best match' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'top-rated', label: 'Top rated' },
]

export const DEFAULT_FILTERS: CatalogFilters = {
  brands: [],
  maxPrice: 1800,
  storages: [],
  colors: [],
  availability: [],
}

export const DEFAULT_SORT: SortOption = 'best-match'

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  'in-stock': 'In stock',
  'low-stock': 'Low stock',
  preorder: 'Pre-order',
  'out-of-stock': 'Out of stock',
}

export const MAX_PRICE = 1800
