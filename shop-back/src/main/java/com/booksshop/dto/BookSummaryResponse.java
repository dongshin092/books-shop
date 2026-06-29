package com.booksshop.dto;

public record BookSummaryResponse(
        String id,
        String title,
        String coverImage,
        String author,
        Integer salePrice
) {
}
