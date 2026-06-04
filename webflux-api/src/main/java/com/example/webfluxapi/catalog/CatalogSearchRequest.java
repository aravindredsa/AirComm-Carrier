package com.example.webfluxapi.catalog;

public record CatalogSearchRequest(
	String keywordOptional,
	CatalogFilters filters,
	String sort,
	Integer page,
	Integer pageSize,
	String channelContext
) {
}