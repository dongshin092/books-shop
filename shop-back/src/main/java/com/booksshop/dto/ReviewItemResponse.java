package com.booksshop.dto;

import com.booksshop.entity.Review;

import java.time.format.DateTimeFormatter;

public record ReviewItemResponse(
        Long reviewId,
        String reviewerName,
        Integer rating,
        String content,
        String reviewDate
) {
    private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static ReviewItemResponse from(Review review) {
        return new ReviewItemResponse(
                review.getId(),
                review.getReviewerName(),
                review.getRating(),
                review.getContent(),
                review.getReviewDate().format(ISO_DATE)
        );
    }
}
