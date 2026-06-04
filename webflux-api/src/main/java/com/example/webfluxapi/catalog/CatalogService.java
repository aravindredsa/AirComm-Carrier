package com.example.webfluxapi.catalog;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;

@Service
public class CatalogService {
	private final CatalogRepository catalogRepository;

	public CatalogService(CatalogRepository catalogRepository) {
		this.catalogRepository = catalogRepository;
	}

	public Mono<CatalogSearchResponse> search(CatalogSearchRequest request, String roleHeader, String correlationIdHeader) {
		String correlationId = resolveCorrelationId(correlationIdHeader);
		String role = normalize(roleHeader);

		return Mono.defer(() -> {
			validateSearchAccess(role, request, correlationId);
			CatalogFilters normalizedFilters = normalizeFilters(request.filters());
			validateSearchPayload(request, normalizedFilters, correlationId);

			String channelContext = normalize(request.channelContext());
			String keyword = normalizeKeyword(request.keywordOptional());
			String sort = normalizeSort(request.sort());
			int page = request.page() == null ? CatalogConstants.DEFAULT_PAGE : request.page();
			int pageSize = request.pageSize() == null ? CatalogConstants.DEFAULT_PAGE_SIZE : request.pageSize();

		return catalogRepository.findAll()
			.collectList()
			.map(products -> buildSearchResponse(products, role, channelContext, keyword, normalizedFilters, sort, page, pageSize, correlationId))
			.onErrorMap(throwable -> {
				if (throwable instanceof CatalogApiException) {
					return throwable;
				}
				return new CatalogApiException(
					HttpStatus.SERVICE_UNAVAILABLE,
					"Catalog service unavailable",
					correlationId,
					"CATALOG_SERVICE_UNAVAILABLE",
					Map.of("purchasableActionsEnabled", false)
				);
			});
		});
	}

	public Mono<CatalogFilterMetadataResponse> metadata(String channelContextRaw, String roleHeader, String correlationIdHeader) {
		String correlationId = resolveCorrelationId(correlationIdHeader);
		String role = normalize(roleHeader);
		String channelContext = normalize(channelContextRaw);

		validateMetadataAccess(role, channelContext, correlationId);

		return catalogRepository.findAll()
			.collectList()
			.map(products -> buildMetadataResponse(products, channelContext, correlationId))
			.onErrorMap(throwable -> {
				if (throwable instanceof CatalogApiException) {
					return throwable;
				}
				return new CatalogApiException(
					HttpStatus.SERVICE_UNAVAILABLE,
					"Filter metadata unavailable",
					correlationId,
					"FILTER_METADATA_UNAVAILABLE",
					Map.of("purchasableActionsEnabled", false)
				);
			});
	}

	private CatalogSearchResponse buildSearchResponse(
		List<CatalogProduct> products,
		String role,
		String channelContext,
		String keyword,
		CatalogFilters filters,
		String sort,
		int page,
		int pageSize,
		String correlationId
	) {
		List<CatalogProduct> eligibleProducts = products.stream()
			.filter(product -> isRoleChannelEligible(product, role, channelContext))
			.filter(product -> matchesKeyword(product, keyword))
			.filter(product -> matchesBrands(product, filters.brands()))
			.filter(product -> matchesPriceRanges(product, filters.priceRanges()))
			.filter(product -> matchesStorage(product, filters.storageOptions()))
			.filter(product -> matchesColors(product, filters.colorOptions()))
			.filter(product -> matchesAvailability(product, filters.availabilityOptions()))
			.collect(Collectors.toCollection(ArrayList::new));

		sortProducts(eligibleProducts, sort, keyword);

		long totalCount = eligibleProducts.size();
		int fromIndex = Math.min((page - 1) * pageSize, eligibleProducts.size());
		int toIndex = Math.min(fromIndex + pageSize, eligibleProducts.size());

		List<CatalogProductView> pageItems = eligibleProducts.subList(fromIndex, toIndex).stream()
			.map(this::toProductView)
			.toList();

		return new CatalogSearchResponse(pageItems, totalCount, page, pageSize, filters, sort, correlationId);
	}

	private CatalogFilterMetadataResponse buildMetadataResponse(List<CatalogProduct> products, String channelContext, String correlationId) {
		List<CatalogProduct> allowedProducts = products.stream()
			.filter(product -> product.allowedChannels().contains(channelContext))
			.toList();

		List<String> brands = allowedProducts.stream()
			.map(CatalogProduct::brand)
			.distinct()
			.sorted()
			.toList();

		List<Integer> storageOptions = allowedProducts.stream()
			.map(CatalogProduct::storageGb)
			.distinct()
			.sorted()
			.toList();

		List<String> colors = allowedProducts.stream()
			.map(CatalogProduct::color)
			.distinct()
			.sorted()
			.toList();

		List<String> availability = allowedProducts.stream()
			.map(this::availabilityOf)
			.collect(Collectors.toCollection(LinkedHashSet::new))
			.stream()
			.toList();

		return new CatalogFilterMetadataResponse(
			brands,
			CatalogConstants.METADATA_PRICE_RANGES,
			storageOptions,
			colors,
			availability,
			correlationId
		);
	}

	private void validateSearchAccess(String role, CatalogSearchRequest request, String correlationId) {
		if (request == null) {
			throw new CatalogApiException(
				HttpStatus.BAD_REQUEST,
				"Invalid search payload",
				correlationId,
				"INVALID_SEARCH_PAYLOAD",
				Map.of()
			);
		}

		validateContext(role, request.channelContext(), correlationId, CatalogConstants.SEARCH_ALLOWED_ROLES);
	}

	private void validateMetadataAccess(String role, String channelContext, String correlationId) {
		validateContext(role, channelContext, correlationId, CatalogConstants.METADATA_ALLOWED_ROLES);
	}

	private void validateContext(String role, String channelContextRaw, String correlationId, Set<String> allowedRoles) {
		String channelContext = normalize(channelContextRaw);
		if (!allowedRoles.contains(role)
			|| !CatalogConstants.SUPPORTED_CHANNELS.contains(channelContext)
			|| !CatalogConstants.ROLE_TO_CHANNEL_SCOPE.getOrDefault(role, Set.of()).contains(channelContext)) {
			throw new CatalogApiException(
				HttpStatus.FORBIDDEN,
				"Product discovery is not permitted for current context",
				correlationId,
				"DISCOVERY_FORBIDDEN",
				Map.of("purchasableActionsEnabled", false)
			);
		}
	}

	private void validateSearchPayload(CatalogSearchRequest request, CatalogFilters filters, String correlationId) {
		String keyword = request.keywordOptional();
		if (keyword != null && !keyword.isBlank()) {
			int keywordLength = keyword.trim().length();
			if (keywordLength < CatalogConstants.KEYWORD_MIN_LENGTH || keywordLength > CatalogConstants.KEYWORD_MAX_LENGTH) {
				throw new CatalogApiException(
					HttpStatus.BAD_REQUEST,
					"Search term is outside allowed length range",
					correlationId,
					"SEARCH_TERM_LENGTH_INVALID",
					Map.of("min", CatalogConstants.KEYWORD_MIN_LENGTH, "max", CatalogConstants.KEYWORD_MAX_LENGTH)
				);
			}
		}

		int page = request.page() == null ? CatalogConstants.DEFAULT_PAGE : request.page();
		int pageSize = request.pageSize() == null ? CatalogConstants.DEFAULT_PAGE_SIZE : request.pageSize();
		if (page < CatalogConstants.PAGE_MIN || pageSize < CatalogConstants.PAGE_SIZE_MIN || pageSize > CatalogConstants.PAGE_SIZE_MAX) {
			throw new CatalogApiException(
				HttpStatus.BAD_REQUEST,
				"Invalid search payload",
				correlationId,
				"INVALID_SEARCH_PAYLOAD",
				Map.of("page", page, "pageSize", pageSize)
			);
		}

		String sort = normalizeSort(request.sort());
		if (!CatalogConstants.SUPPORTED_SORTS.contains(sort)) {
			throw new CatalogApiException(
				HttpStatus.BAD_REQUEST,
				"Invalid search payload",
				correlationId,
				"INVALID_SEARCH_PAYLOAD",
				Map.of("sort", sort)
			);
		}

		validateFilterDomain(filters, correlationId);
	}

	private void validateFilterDomain(CatalogFilters filters, String correlationId) {
		boolean validBrands = filters.brands().stream().allMatch(CatalogConstants.SUPPORTED_BRANDS::contains);
		boolean validPriceRanges = filters.priceRanges().stream().allMatch(CatalogConstants.SUPPORTED_PRICE_RANGES::contains);
		boolean validStorage = filters.storageOptions().stream().allMatch(CatalogConstants.SUPPORTED_STORAGE_OPTIONS::contains);
		boolean validColors = filters.colorOptions().stream().allMatch(CatalogConstants.SUPPORTED_COLORS::contains);
		boolean validAvailability = filters.availabilityOptions().stream().allMatch(CatalogConstants.SUPPORTED_AVAILABILITY::contains);

		if (!validBrands || !validPriceRanges || !validStorage || !validColors || !validAvailability) {
			throw new CatalogApiException(
				HttpStatus.UNPROCESSABLE_ENTITY,
				"One or more filter values are invalid",
				correlationId,
				"INVALID_FILTERS",
				Map.of("purchasableActionsEnabled", false)
			);
		}
	}

	private CatalogFilters normalizeFilters(CatalogFilters filters) {
		if (filters == null) {
			return CatalogFilters.empty();
		}

		return new CatalogFilters(
			normalizeStringList(filters.brands()),
			normalizeStringList(filters.priceRanges()),
			filters.storageOptions() == null ? List.of() : List.copyOf(filters.storageOptions()),
			normalizeStringList(filters.colorOptions()),
			normalizeStringList(filters.availabilityOptions())
		);
	}

	private List<String> normalizeStringList(List<String> values) {
		if (values == null) {
			return List.of();
		}

		return values.stream()
			.map(this::normalize)
			.filter(value -> !value.isBlank())
			.distinct()
			.toList();
	}

	private boolean isRoleChannelEligible(CatalogProduct product, String role, String channelContext) {
		return CatalogConstants.ROLE_TO_CHANNEL_SCOPE.getOrDefault(role, Set.of()).contains(channelContext)
			&& product.allowedChannels().contains(channelContext);
	}

	private boolean matchesKeyword(CatalogProduct product, String keyword) {
		if (keyword == null) {
			return true;
		}

		String productName = product.name().toLowerCase(Locale.ROOT);
		String productBrand = product.brand().toLowerCase(Locale.ROOT);
		return productName.contains(keyword) || productBrand.contains(keyword);
	}

	private boolean matchesBrands(CatalogProduct product, List<String> brands) {
		return brands.isEmpty() || brands.contains(product.brand());
	}

	private boolean matchesPriceRanges(CatalogProduct product, List<String> priceRanges) {
		if (priceRanges.isEmpty()) {
			return true;
		}

		return priceRanges.stream().anyMatch(priceRange -> switch (priceRange) {
			case "UNDER_500" -> product.price().compareTo(new BigDecimal("500.00")) < 0;
			case "BETWEEN_500_1000" -> product.price().compareTo(new BigDecimal("500.00")) >= 0
				&& product.price().compareTo(new BigDecimal("1000.00")) <= 0;
			case "OVER_1000" -> product.price().compareTo(new BigDecimal("1000.00")) > 0;
			default -> false;
		});
	}

	private boolean matchesStorage(CatalogProduct product, List<Integer> storageOptions) {
		return storageOptions.isEmpty() || storageOptions.contains(product.storageGb());
	}

	private boolean matchesColors(CatalogProduct product, List<String> colors) {
		return colors.isEmpty() || colors.contains(product.color());
	}

	private boolean matchesAvailability(CatalogProduct product, List<String> availabilityOptions) {
		return availabilityOptions.isEmpty() || availabilityOptions.contains(availabilityOf(product));
	}

	private CatalogProductView toProductView(CatalogProduct product) {
		String availability = availabilityOf(product);
		return new CatalogProductView(
			product.id(),
			product.name(),
			product.brand(),
			product.price(),
			product.storageGb(),
			product.color(),
			availability,
			"IN_STOCK".equals(availability)
		);
	}

	private String availabilityOf(CatalogProduct product) {
		return product.inventoryQuantity() > 0 ? "IN_STOCK" : "OUT_OF_STOCK";
	}

	private void sortProducts(List<CatalogProduct> products, String sort, String keyword) {
		Comparator<CatalogProduct> comparator = switch (sort) {
			case "PRICE_ASC" -> Comparator.comparing(CatalogProduct::price).thenComparing(CatalogProduct::name);
			case "PRICE_DESC" -> Comparator.comparing(CatalogProduct::price).reversed().thenComparing(CatalogProduct::name);
			case "NAME_ASC" -> Comparator.comparing(CatalogProduct::name);
			case "RELEVANCE" -> relevanceComparator(keyword);
			default -> Comparator.comparing(CatalogProduct::name);
		};

		products.sort(comparator);
	}

	private Comparator<CatalogProduct> relevanceComparator(String keyword) {
		if (keyword == null) {
			return Comparator.comparing(CatalogProduct::name);
		}

		return Comparator
			.comparingInt((CatalogProduct product) -> relevanceScore(product, keyword))
			.reversed()
			.thenComparing(CatalogProduct::name);
	}

	private int relevanceScore(CatalogProduct product, String keyword) {
		String productName = product.name().toLowerCase(Locale.ROOT);
		String productBrand = product.brand().toLowerCase(Locale.ROOT);
		if (productName.startsWith(keyword)) {
			return 3;
		}
		if (productName.contains(keyword)) {
			return 2;
		}
		if (productBrand.contains(keyword)) {
			return 1;
		}
		return 0;
	}

	private String normalizeKeyword(String keyword) {
		if (keyword == null || keyword.isBlank()) {
			return null;
		}
		return keyword.trim().toLowerCase(Locale.ROOT);
	}

	private String normalizeSort(String sort) {
		if (sort == null || sort.isBlank()) {
			return CatalogConstants.DEFAULT_SORT;
		}
		return normalize(sort);
	}

	private String normalize(String value) {
		if (value == null) {
			return "";
		}
		return value.trim().toUpperCase(Locale.ROOT);
	}

	private String resolveCorrelationId(String correlationIdHeader) {
		if (correlationIdHeader == null || correlationIdHeader.isBlank()) {
			return UUID.randomUUID().toString();
		}
		return correlationIdHeader;
	}
}