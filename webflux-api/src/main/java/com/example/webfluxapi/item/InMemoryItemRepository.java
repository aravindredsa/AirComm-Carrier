package com.example.webfluxapi.item;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public class InMemoryItemRepository implements ItemRepository {
	private final Map<String, Item> store = new ConcurrentHashMap<>();

	@Override
	public Flux<Item> findAll() {
		return Flux.fromIterable(store.values());
	}

	@Override
	public Mono<Item> findById(String id) {
		Item item = store.get(id);
		return item == null ? Mono.empty() : Mono.just(item);
	}

	@Override
	public Mono<Item> save(Item item) {
		String id = item.id();
		if (id == null || id.isBlank()) {
			id = UUID.randomUUID().toString();
		}

		Item saved = new Item(id, item.name(), item.description());
		store.put(id, saved);
		return Mono.just(saved);
	}

	@Override
	public Mono<Void> deleteById(String id) {
		store.remove(id);
		return Mono.empty();
	}
}
