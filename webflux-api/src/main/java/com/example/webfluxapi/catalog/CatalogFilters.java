package com.example.webfluxapi.catalog;

import java.util.List;

public record CatalogFilters(
	List<String> brands,
	List<String> priceRanges,
	List<Integer> storageOptions,
	List<String> colorOptions,
	List<String> availabilityOptions
) {
	public static CatalogFilters empty() {
		return new CatalogFilters(List.of(), List.of(), List.of(), List.of(), List.of());
	}
}