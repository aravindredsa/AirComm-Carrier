package com.example.webfluxapi.catalog;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Repository;

import reactor.core.publisher.Flux;

@Repository
public class InMemoryCatalogRepository implements CatalogRepository {
	private static final List<CatalogProduct> PRODUCTS = List.of(
		new CatalogProduct("p-apple-15pro", "iPhone 15 Pro", "APPLE", new BigDecimal("1299.00"), 256, "GRAY", Set.of("STOREFRONT", "AGENT_PORTAL"), 14),
		new CatalogProduct("p-apple-15", "iPhone 15", "APPLE", new BigDecimal("899.00"), 128, "BLUE", Set.of("STOREFRONT", "AGENT_PORTAL"), 8),
		new CatalogProduct("p-samsung-s24", "Samsung Galaxy S24", "SAMSUNG", new BigDecimal("999.00"), 256, "BLACK", Set.of("STOREFRONT", "AGENT_PORTAL"), 7),
		new CatalogProduct("p-google-p8", "Google Pixel 8", "GOOGLE", new BigDecimal("699.00"), 128, "BLACK", Set.of("STOREFRONT", "AGENT_PORTAL"), 0),
		new CatalogProduct("p-oneplus-12", "OnePlus 12", "ONEPLUS", new BigDecimal("799.00"), 256, "WHITE", Set.of("AGENT_PORTAL"), 12),
		new CatalogProduct("p-apple-se", "iPhone SE", "APPLE", new BigDecimal("429.00"), 128, "BLACK", Set.of("STOREFRONT"), 6)
	);

	@Override
	public Flux<CatalogProduct> findAll() {
		return Flux.fromIterable(PRODUCTS);
	}
}