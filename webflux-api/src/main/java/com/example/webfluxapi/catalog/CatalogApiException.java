package com.example.webfluxapi.catalog;

import java.util.Map;

import org.springframework.http.HttpStatus;

public class CatalogApiException extends RuntimeException {
	private final HttpStatus status;
	private final String correlationId;
	private final String errorCode;
	private final Map<String, Object> details;

	public CatalogApiException(HttpStatus status, String message, String correlationId, String errorCode, Map<String, Object> details) {
		super(message);
		this.status = status;
		this.correlationId = correlationId;
		this.errorCode = errorCode;
		this.details = details;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public String getCorrelationId() {
		return correlationId;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public Map<String, Object> getDetails() {
		return details;
	}
}