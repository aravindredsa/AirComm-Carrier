package com.example.webfluxapi.catalog;

import java.util.List;

public record CatalogSearchResponse(
	List<CatalogProductView> items,
	long totalCount,
	int page,
	int pageSize,
	CatalogFilters appliedFilters,
	String sort,
	String correlationId
) {
}