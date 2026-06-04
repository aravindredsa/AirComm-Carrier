package com.example.webfluxapi.api;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class HelloController {

	@GetMapping("/ping")
	public Mono<ApiResponse<String>> ping() {
		return Mono.just(ApiResponse.success("Service is healthy", "ok"));
	}

	@GetMapping("/hello")
	public Mono<ApiResponse<String>> hello() {
		return Mono.just(ApiResponse.success("Greeting generated", "Hello from Spring WebFlux"));
	}
}
