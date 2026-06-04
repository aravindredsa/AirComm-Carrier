package com.example.webfluxapi.catalog;

import reactor.core.publisher.Flux;

public interface CatalogRepository {
	Flux<CatalogProduct> findAll();
}