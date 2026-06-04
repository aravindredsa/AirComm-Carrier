export type CatalogRole = 'customer' | 'sales-agent' | 'manager' | 'admin'

export type Brand = 'Apple' | 'Samsung' | 'Google'

export type StorageOption = '128 GB' | '256 GB' | '512 GB' | '1 TB'

export type Availability =
  | 'in-stock'
  | 'low-stock'
  | 'preorder'
  | 'out-of-stock'

export type SortOption = 'best-match' | 'price-low' | 'price-high' | 'top-rated'

export interface CatalogProduct {
  id: string
  name: string
  brand: Brand
  monthlyPrice: number
  originalPrice: number
  rating: number
  reviewCount: number
  storageOptions: StorageOption[]
  colorOptions: string[]
  availability: Availability
  description: string
  badge: string
  heroGradient: string
  supportNote: string
}

export interface CatalogFilters {
  brands: Brand[]
  maxPrice: number
  storages: StorageOption[]
  colors: string[]
  availability: Availability[]
}

export interface CatalogQuery {
  searchTerm: string
  filters: CatalogFilters
  sortBy: SortOption
  signal?: AbortSignal
}

export interface CatalogResult {
  products: CatalogProduct[]
  total: number
}

export interface CatalogService {
  searchProducts(query: CatalogQuery): Promise<CatalogResult>
}
