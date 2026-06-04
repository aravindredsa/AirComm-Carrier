package com.example.webfluxapi.catalog;

import java.math.BigDecimal;

public record CatalogProductView(
	String id,
	String name,
	String brand,
	BigDecimal price,
	int storageGb,
	String color,
	String availability,
	boolean purchasable
) {
}