import {
  AVAILABILITY_OPTIONS,
  BRANDS,
  COLOR_OPTIONS,
  SEARCH_TERM_LIMITS,
  STORAGE_OPTIONS,
} from './catalog.constants'
import type {
  CatalogFilters,
  CatalogProduct,
  CatalogQuery,
  SortOption,
} from './catalog.types'

export function validateSearchTerm(searchTerm: string): string | null {
  const trimmedTerm = searchTerm.trim()

  if (trimmedTerm.length === 0) {
    return null
  }

  if (trimmedTerm.length < SEARCH_TERM_LIMITS.min || trimmedTerm.length > SEARCH_TERM_LIMITS.max) {
    return `Search term is outside allowed length range (${SEARCH_TERM_LIMITS.min}-${SEARCH_TERM_LIMITS.max} characters).`
  }

  return null
}

export function validateFilters(filters: CatalogFilters): string | null {
  const invalidBrand = filters.brands.some((brand) => !BRANDS.includes(brand))
  const invalidStorage = filters.storages.some((storage) => !STORAGE_OPTIONS.includes(storage))
  const invalidColor = filters.colors.some((color) => !COLOR_OPTIONS.includes(color))
  const invalidAvailability = filters.availability.some(
    (availability) => !AVAILABILITY_OPTIONS.includes(availability),
  )

  if (invalidBrand || invalidStorage || invalidColor || invalidAvailability) {
    return 'One or more filter values are invalid.'
  }

  return null
}

export function filterProducts(products: CatalogProduct[], query: CatalogQuery): CatalogProduct[] {
  const normalizedTerm = query.searchTerm.trim().toLowerCase()

  return products.filter((product) => {
    const matchesSearch =
      normalizedTerm.length === 0 ||
      product.name.toLowerCase().includes(normalizedTerm) ||
      product.brand.toLowerCase().includes(normalizedTerm) ||
      product.description.toLowerCase().includes(normalizedTerm)

    const matchesBrand =
      query.filters.brands.length === 0 || query.filters.brands.includes(product.brand)

    const matchesPrice = product.originalPrice <= query.filters.maxPrice

    const matchesStorage =
      query.filters.storages.length === 0 ||
      query.filters.storages.some((storage) => product.storageOptions.includes(storage))

    const matchesColor =
      query.filters.colors.length === 0 ||
      query.filters.colors.some((color) => product.colorOptions.includes(color))

    const matchesAvailability =
      query.filters.availability.length === 0 ||
      query.filters.availability.includes(product.availability)

    return (
      matchesSearch &&
      matchesBrand &&
      matchesPrice &&
      matchesStorage &&
      matchesColor &&
      matchesAvailability
    )
  })
}

export function sortProducts(products: CatalogProduct[], sortBy: SortOption): CatalogProduct[] {
  const sortedProducts = [...products]

  switch (sortBy) {
    case 'price-low':
      return sortedProducts.sort((left, right) => left.originalPrice - right.originalPrice)
    case 'price-high':
      return sortedProducts.sort((left, right) => right.originalPrice - left.originalPrice)
    case 'top-rated':
      return sortedProducts.sort((left, right) => right.rating - left.rating)
    case 'best-match':
    default:
      return sortedProducts.sort((left, right) => {
        const availabilityWeight = availabilityRank(left.availability) - availabilityRank(right.availability)

        if (availabilityWeight !== 0) {
          return availabilityWeight
        }

        return right.reviewCount - left.reviewCount
      })
  }
}

function availabilityRank(availability: CatalogProduct['availability']): number {
  switch (availability) {
    case 'in-stock':
      return 0
    case 'low-stock':
      return 1
    case 'preorder':
      return 2
    case 'out-of-stock':
      return 3
  }
}

export function isProductPurchasable(product: CatalogProduct): boolean {
  return product.availability !== 'out-of-stock'
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
