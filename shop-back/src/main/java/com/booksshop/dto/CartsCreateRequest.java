package com.booksshop.dto;

import jakarta.validation.constraints.NotBlank;

public record CartsCreateRequest(
        @NotBlank String bookId,
        Integer quantity
) {
}
