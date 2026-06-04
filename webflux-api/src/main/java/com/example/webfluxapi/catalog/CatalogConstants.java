package com.example.webfluxapi.catalog;

import java.util.List;
import java.util.Map;
import java.util.Set;

public final class CatalogConstants {
	private CatalogConstants() {
	}

	public static final int KEYWORD_MIN_LENGTH = 2;
	public static final int KEYWORD_MAX_LENGTH = 80;
	public static final int PAGE_MIN = 1;
	public static final int PAGE_SIZE_MIN = 1;
	public static final int PAGE_SIZE_MAX = 50;
	public static final int DEFAULT_PAGE = 1;
	public static final int DEFAULT_PAGE_SIZE = 12;
	public static final String DEFAULT_SORT = "RELEVANCE";

	public static final Set<String> SEARCH_ALLOWED_ROLES = Set.of("CUSTOMER", "SALES_AGENT");
	public static final Set<String> METADATA_ALLOWED_ROLES = Set.of("CUSTOMER", "SALES_AGENT", "STORE_MANAGER", "ADMINISTRATOR");
	public static final Set<String> SUPPORTED_CHANNELS = Set.of("STOREFRONT", "AGENT_PORTAL");

	public static final Map<String, Set<String>> ROLE_TO_CHANNEL_SCOPE = Map.of(
		"CUSTOMER", Set.of("STOREFRONT"),
		"SALES_AGENT", Set.of("AGENT_PORTAL", "STOREFRONT"),
		"STORE_MANAGER", Set.of("AGENT_PORTAL"),
		"ADMINISTRATOR", Set.of("STOREFRONT", "AGENT_PORTAL")
	);

	public static final Set<String> SUPPORTED_BRANDS = Set.of("APPLE", "GOOGLE", "SAMSUNG", "ONEPLUS");
	public static final Set<String> SUPPORTED_PRICE_RANGES = Set.of("UNDER_500", "BETWEEN_500_1000", "OVER_1000");
	public static final Set<Integer> SUPPORTED_STORAGE_OPTIONS = Set.of(128, 256, 512, 1024);
	public static final Set<String> SUPPORTED_COLORS = Set.of("BLACK", "BLUE", "GRAY", "PURPLE", "WHITE");
	public static final Set<String> SUPPORTED_AVAILABILITY = Set.of("IN_STOCK", "OUT_OF_STOCK");

	public static final Set<String> SUPPORTED_SORTS = Set.of("RELEVANCE", "PRICE_ASC", "PRICE_DESC", "NAME_ASC");

	public static final List<String> METADATA_PRICE_RANGES = List.of("UNDER_500", "BETWEEN_500_1000", "OVER_1000");
}