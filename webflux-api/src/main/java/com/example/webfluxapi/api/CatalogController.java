package com.example.webfluxapi.api;

import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.webfluxapi.catalog.CatalogFilterMetadataResponse;
import com.example.webfluxapi.catalog.CatalogSearchRequest;
import com.example.webfluxapi.catalog.CatalogSearchResponse;
import com.example.webfluxapi.catalog.CatalogService;

import reactor.core.publisher.Mono;

@Validated
@RestController
@RequestMapping(path = "/api/catalog", produces = MediaType.APPLICATION_JSON_VALUE)
public class CatalogController {
	private final CatalogService catalogService;

	public CatalogController(CatalogService catalogService) {
		this.catalogService = catalogService;
	}

	@PostMapping(path = "/search", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Mono<ApiResponse<CatalogSearchResponse>> search(
		@RequestBody(required = false) CatalogSearchRequest request,
		@RequestHeader(name = "X-Role") String role,
		@RequestHeader(name = "X-Correlation-Id", required = false) String correlationId
	) {
		return catalogService.search(request, role, correlationId)
			.map(response -> ApiResponse.success("Catalog search completed", response));
	}

	@GetMapping(path = "/filters/metadata")
	public Mono<ApiResponse<CatalogFilterMetadataResponse>> metadata(
		@RequestParam("channelContext") String channelContext,
		@RequestHeader(name = "X-Role") String role,
		@RequestHeader(name = "X-Correlation-Id", required = false) String correlationId
	) {
		return catalogService.metadata(channelContext, role, correlationId)
			.map(response -> ApiResponse.success("Catalog filter metadata retrieved", response));
	}
}