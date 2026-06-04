package com.example.webfluxapi.api;

import java.time.Instant;

public record ApiResponse<T>(
	String status,
	String message,
	T data,
	Instant timestamp
) {
	public static <T> ApiResponse<T> success(String message, T data) {
		return new ApiResponse<>("success", message, data, Instant.now());
	}

	public static <T> ApiResponse<T> success(T data) {
		return success("Request completed successfully", data);
	}

	public static ApiResponse<Void> successMessage(String message) {
		return new ApiResponse<>("success", message, null, Instant.now());
	}

	public static ApiResponse<Object> error(String message, Object data) {
		return new ApiResponse<>("error", message, data, Instant.now());
	}
}
