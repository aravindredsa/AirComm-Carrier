package com.example.webfluxapi.catalog;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;

class CatalogServiceTest {

	@Test
	void searchReturnsEligibleProductsWithPaginationAndSortMetadata() {
		StubCatalogRepository repository = new StubCatalogRepository(Flux.fromIterable(sampleProducts()));
		CatalogService service = new CatalogService(repository);

		CatalogSearchRequest request = new CatalogSearchRequest(
			"iphone",
			new CatalogFilters(List.of("APPLE"), List.of(), List.of(), List.of(), List.of("IN_STOCK")),
			"NAME_ASC",
			1,
			10,
			"storefront"
		);

		StepVerifier.create(service.search(request, "customer", "corr-happy"))
			.assertNext(response -> {
				assertThat(response.correlationId()).isEqualTo("corr-happy");
				assertThat(response.items()).hasSize(2);
				assertThat(response.totalCount()).isEqualTo(2);
				assertThat(response.items()).allMatch(CatalogProductView::purchasable);
				assertThat(response.items().getFirst().name()).isEqualTo("iPhone 15");
				assertThat(response.sort()).isEqualTo("NAME_ASC");
			})
			.verifyComplete();

		assertThat(repository.findAllInvocations).isEqualTo(1);
	}

	@Test
	void searchWithoutFiltersReturnsBaselineListing() {
		StubCatalogRepository repository = new StubCatalogRepository(Flux.fromIterable(sampleProducts()));
		CatalogService service = new CatalogService(repository);

		CatalogSearchRequest request = new CatalogSearchRequest(
			null,
			null,
			null,
			null,
			null,
			"STOREFRONT"
		);

		StepVerifier.create(service.search(request, "CUSTOMER", "corr-baseline"))
			.assertNext(response -> {
				assertThat(response.page()).isEqualTo(1);
				assertThat(response.pageSize()).isEqualTo(12);
				assertThat(response.items()).isNotEmpty();
				assertThat(response.appliedFilters().brands()).isEmpty();
			})
			.verifyComplete();
	}

	@Test
	void searchReturnsBadRequestForInvalidKeywordLength() {
		StubCatalogRepository repository = new StubCatalogRepository(Flux.fromIterable(sampleProducts()));
		CatalogService service = new CatalogService(repository);

		CatalogSearchRequest request = new CatalogSearchRequest(
			"a",
			CatalogFilters.empty(),
			"RELEVANCE",
			1,
			10,
			"STOREFRONT"
		);

		StepVerifier.create(service.search(request, "CUSTOMER", "corr-bad-keyword"))
			.expectErrorSatisfies(throwable -> {
				assertThat(throwable).isInstanceOf(CatalogApiException.class);
				CatalogApiException error = (CatalogApiException) throwable;
				assertThat(error.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
				assertThat(error.getMessage()).isEqualTo("Search term is outside allowed length range");
			})
			.verify();
	}

	@Test
	void searchReturnsUnprocessableEntityForInvalidFilterValues() {
		StubCatalogRepository repository = new StubCatalogRepository(Flux.fromIterable(sampleProducts()));
		CatalogService service = new CatalogService(repository);

		CatalogSearchRequest request = new CatalogSearchRequest(
			null,
			new CatalogFilters(List.of("NOKIA"), List.of(), List.of(), List.of(), List.of()),
			"RELEVANCE",
			1,
			10,
			"STOREFRONT"
		);

		StepVerifier.create(service.search(request, "CUSTOMER", "corr-filter"))
			.expectErrorSatisfies(throwable -> {
				assertThat(throwable).isInstanceOf(CatalogApiException.class);
				CatalogApiException error = (CatalogApiException) throwable;
				assertThat(error.getStatus()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
				assertThat(error.getMessage()).isEqualTo("One or more filter values are invalid");
			})
			.verify();
	}

	@Test
	void searchReturnsForbiddenForDisallowedRoleChannelContext() {
		StubCatalogRepository repository = new StubCatalogRepository(Flux.fromIterable(sampleProducts()));
		CatalogService service = new CatalogService(repository);

		CatalogSearchRequest request = new CatalogSearchRequest(
			null,
			CatalogFilters.empty(),
			"RELEVANCE",
			1,
			10,
			"AGENT_PORTAL"
		);

		StepVerifier.create(service.search(request, "CUSTOMER", "corr-forbidden"))
			.expectErrorSatisfies(throwable -> {
				assertThat(throwable).isInstanceOf(CatalogApiException.class);
				CatalogApiException error = (CatalogApiException) throwable;
				assertThat(error.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
				assertThat(error.getMessage()).isEqualTo("Product discovery is not permitted for current context");
			})
			.verify();

		assertThat(repository.findAllInvocations).isZero();
	}

	@Test
	void searchMapsRepositoryFailureToServiceUnavailable() {
		StubCatalogRepository repository = new StubCatalogRepository(Flux.error(new RuntimeException("catalog-down")));
		CatalogService service = new CatalogService(repository);

		CatalogSearchRequest request = new CatalogSearchRequest(
			null,
			CatalogFilters.empty(),
			"RELEVANCE",
			1,
			10,
			"STOREFRONT"
		);

		StepVerifier.create(service.search(request, "CUSTOMER", "corr-503"))
			.expectErrorSatisfies(throwable -> {
				assertThat(throwable).isInstanceOf(CatalogApiException.class);
				CatalogApiException error = (CatalogApiException) throwable;
				assertThat(error.getStatus()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
				assertThat(error.getMessage()).isEqualTo("Catalog service unavailable");
				assertThat(error.getDetails()).containsEntry("purchasableActionsEnabled", false);
			})
			.verify();
	}

	private List<CatalogProduct> sampleProducts() {
		return List.of(
			new CatalogProduct("p1", "iPhone 15", "APPLE", new BigDecimal("899.00"), 128, "BLUE", Set.of("STOREFRONT", "AGENT_PORTAL"), 10),
			new CatalogProduct("p2", "iPhone 15 Pro", "APPLE", new BigDecimal("1299.00"), 256, "GRAY", Set.of("STOREFRONT"), 7),
			new CatalogProduct("p3", "Google Pixel 8", "GOOGLE", new BigDecimal("699.00"), 128, "BLACK", Set.of("STOREFRONT"), 0),
			new CatalogProduct("p4", "OnePlus 12", "ONEPLUS", new BigDecimal("799.00"), 256, "WHITE", Set.of("AGENT_PORTAL"), 5)
		);
	}

	private static class StubCatalogRepository implements CatalogRepository {
		private final Flux<CatalogProduct> products;
		private int findAllInvocations;

		private StubCatalogRepository(Flux<CatalogProduct> products) {
			this.products = products;
		}

		@Override
		public Flux<CatalogProduct> findAll() {
			findAllInvocations++;
			return products;
		}
	}
}