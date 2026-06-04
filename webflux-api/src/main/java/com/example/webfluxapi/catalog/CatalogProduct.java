package com.example.webfluxapi.catalog;

import java.math.BigDecimal;
import java.util.Set;

public record CatalogProduct(
	String id,
	String name,
	String brand,
	BigDecimal price,
	int storageGb,
	String color,
	Set<String> allowedChannels,
	int inventoryQuantity
) {
}