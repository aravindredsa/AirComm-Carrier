import { CATALOG_PRODUCTS } from './catalog.data'
import { filterProducts, sortProducts, validateFilters, validateSearchTerm } from './catalog.utils'
import type { CatalogQuery, CatalogResult, CatalogService } from './catalog.types'

async function delay(durationMs: number, signal?: AbortSignal): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      cleanup()
      resolve()
    }, durationMs)

    function onAbort() {
      cleanup()
      reject(new DOMException('Aborted', 'AbortError'))
    }

    function cleanup() {
      window.clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
    }

    signal?.addEventListener('abort', onAbort)
  })
}

export function createCatalogService(delayMs = 450): CatalogService {
  return {
    async searchProducts(query: CatalogQuery): Promise<CatalogResult> {
      const searchError = validateSearchTerm(query.searchTerm)
      if (searchError) {
        throw new Error(searchError)
      }

      const filterError = validateFilters(query.filters)
      if (filterError) {
        throw new Error(filterError)
      }

      await delay(delayMs, query.signal)

      const products = sortProducts(filterProducts(CATALOG_PRODUCTS, query), query.sortBy)

      return {
        products,
        total: products.length,
      }
    },
  }
}

export const catalogService = createCatalogService()
