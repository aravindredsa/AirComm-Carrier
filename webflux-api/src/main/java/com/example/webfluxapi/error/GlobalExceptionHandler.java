package com.example.webfluxapi.error;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;

import com.example.webfluxapi.api.ApiResponse;
import com.example.webfluxapi.catalog.CatalogApiException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
			.body(ApiResponse.error(ex.getMessage(), null));
	}

	@ExceptionHandler(WebExchangeBindException.class)
	public ResponseEntity<ApiResponse<Object>> handleValidation(WebExchangeBindException ex) {
		Map<String, String> fieldErrors = new LinkedHashMap<>();
		for (FieldError fieldError : ex.getFieldErrors()) {
			fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
		}

		return ResponseEntity.badRequest()
			.body(ApiResponse.error("Validation failed", fieldErrors));
	}

	@ExceptionHandler(CatalogApiException.class)
	public ResponseEntity<ApiResponse<Object>> handleCatalogApiError(CatalogApiException ex) {
		Map<String, Object> details = new LinkedHashMap<>();
		details.put("correlationId", ex.getCorrelationId());
		details.put("errorCode", ex.getErrorCode());
		if (ex.getDetails() != null) {
			details.putAll(ex.getDetails());
		}

		return ResponseEntity.status(ex.getStatus())
			.body(ApiResponse.error(ex.getMessage(), details));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Object>> handleUnhandled(Exception ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(ApiResponse.error("Unexpected error occurred", null));
	}
}
