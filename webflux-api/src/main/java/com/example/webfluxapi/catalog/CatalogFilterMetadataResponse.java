package com.example.webfluxapi.catalog;

import java.util.List;

public record CatalogFilterMetadataResponse(
	List<String> brands,
	List<String> priceRanges,
	List<Integer> storageOptions,
	List<String> colorOptions,
	List<String> availabilityOptions,
	String correlationId
) {
}