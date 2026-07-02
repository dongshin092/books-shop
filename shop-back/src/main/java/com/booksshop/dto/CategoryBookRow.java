package com.booksshop.dto;

import java.time.LocalDate;

public record CategoryBookRow(
        String bookId,
        String title,
        String subtitle,
        String author,
        String publisher,
        LocalDate publishedDate,
        String coverImage,
        Integer listPrice,
        Integer salePrice,
        Double reviewRating,
        Long reviewCount,
        String bestYn,
        String newYn
) {
}
