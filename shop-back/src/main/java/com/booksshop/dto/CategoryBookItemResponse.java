package com.booksshop.dto;

import java.time.format.DateTimeFormatter;

public record CategoryBookItemResponse(
        String bookId,
        String title,
        String subtitle,
        String author,
        String publisher,
        String publishedDate,
        String coverImage,
        Integer listPrice,
        Integer salePrice,
        Double reviewRating,
        Long reviewCount,
        String badge
) {
    private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static CategoryBookItemResponse from(CategoryBookRow row) {
        String badge = "Y".equals(row.bestYn()) ? "BEST" : "Y".equals(row.newYn()) ? "NEW" : null;

        return new CategoryBookItemResponse(
                row.bookId(),
                row.title(),
                row.subtitle(),
                row.author(),
                row.publisher(),
                row.publishedDate() != null ? row.publishedDate().format(ISO_DATE) : null,
                row.coverImage(),
                row.listPrice(),
                row.salePrice(),
                row.reviewRating() != null ? row.reviewRating() : 0.0,
                row.reviewCount() != null ? row.reviewCount() : 0L,
                badge
        );
    }
}
