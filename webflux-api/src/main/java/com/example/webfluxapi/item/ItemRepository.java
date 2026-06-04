package com.example.webfluxapi.item;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ItemRepository {
	Flux<Item> findAll();

	Mono<Item> findById(String id);

	Mono<Item> save(Item item);

	Mono<Void> deleteById(String id);
}
