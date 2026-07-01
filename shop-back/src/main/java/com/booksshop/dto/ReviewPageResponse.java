package com.booksshop.dto;

import java.util.List;

public record ReviewPageResponse(
        long totalCount,
        int page,
        int size,
        int totalPages,
        List<ReviewItemResponse> items
) {
    public static ReviewPageResponse empty(int page, int size) {
        return new ReviewPageResponse(0, page, size, 0, List.of());
    }
}
