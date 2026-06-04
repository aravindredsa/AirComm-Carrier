package com.example.webfluxapi.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.webfluxapi.item.CreateItemRequest;
import com.example.webfluxapi.item.Item;
import com.example.webfluxapi.item.ItemService;
import com.example.webfluxapi.item.UpdateItemRequest;

import jakarta.validation.Valid;
import reactor.core.publisher.Mono;

@Validated
@RestController
@RequestMapping(path = "/api/v1/items", produces = MediaType.APPLICATION_JSON_VALUE)
public class ItemController {
	private final ItemService itemService;

	public ItemController(ItemService itemService) {
		this.itemService = itemService;
	}

	@GetMapping
	public Mono<ApiResponse<List<Item>>> findAll() {
		return itemService.findAll()
			.collectList()
			.map(items -> ApiResponse.success("Items retrieved successfully", items));
	}

	@GetMapping("/{id}")
	public Mono<ApiResponse<Item>> findById(@PathVariable String id) {
		return itemService.findById(id)
			.map(item -> ApiResponse.success("Item retrieved successfully", item));
	}

	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public Mono<ResponseEntity<ApiResponse<Item>>> create(@Valid @RequestBody CreateItemRequest request) {
		return itemService.create(request)
			.map(item -> ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Item created successfully", item)));
	}

	@PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Mono<ApiResponse<Item>> update(@PathVariable String id, @Valid @RequestBody UpdateItemRequest request) {
		return itemService.update(id, request)
			.map(item -> ApiResponse.success("Item updated successfully", item));
	}

	@DeleteMapping("/{id}")
	public Mono<ApiResponse<Void>> delete(@PathVariable String id) {
		return itemService.delete(id)
			.thenReturn(ApiResponse.successMessage("Item deleted successfully"));
	}
}
