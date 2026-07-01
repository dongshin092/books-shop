package com.booksshop.dto;

public record CartsItemResponse(
        String itemId,
        String bookId,
        String title,
        String author,
        String publisher,
        Integer salePrice,
        Integer quantity
) {
}
