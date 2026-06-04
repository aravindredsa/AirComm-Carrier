package com.example.webfluxapi.item;

import org.springframework.stereotype.Service;

import com.example.webfluxapi.error.ResourceNotFoundException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ItemService {
	private final ItemRepository itemRepository;

	public ItemService(ItemRepository itemRepository) {
		this.itemRepository = itemRepository;
	}

	public Flux<Item> findAll() {
		return itemRepository.findAll();
	}

	public Mono<Item> findById(String id) {
		return itemRepository.findById(id)
			.switchIfEmpty(Mono.error(new ResourceNotFoundException("Item not found: " + id)));
	}

	public Mono<Item> create(CreateItemRequest request) {
		Item item = new Item(null, request.name(), request.description());
		return itemRepository.save(item);
	}

	public Mono<Item> update(String id, UpdateItemRequest request) {
		return findById(id)
			.flatMap(existing -> itemRepository.save(new Item(existing.id(), request.name(), request.description())));
	}

	public Mono<Void> delete(String id) {
		return findById(id)
			.flatMap(existing -> itemRepository.deleteById(existing.id()));
	}
}
