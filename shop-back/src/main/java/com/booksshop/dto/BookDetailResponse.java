package com.booksshop.dto;

import com.booksshop.entity.Book;

import java.time.format.DateTimeFormatter;

public record BookDetailResponse(
        String bookId,
        String title,
        String coverImage,
        String author,
        String publisher,
        String publishedDate,
        Integer listPrice,
        Integer salePrice,
        Integer stocks,
        String categoryName,
        String description,
        ReviewPageResponse reviewList
) {
    private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static BookDetailResponse of(Book book, String categoryName, ReviewPageResponse reviewList) {
        return new BookDetailResponse(
                book.getId(),
                book.getTitle(),
                book.getCoverImage(),
                book.getAuthor(),
                book.getPublisher(),
                book.getPublishedDate() != null ? book.getPublishedDate().format(ISO_DATE) : null,
                book.getListPrice(),
                book.getSalePrice(),
                book.getStocks(),
                categoryName,
                book.getDescription(),
                reviewList
        );
    }
}
