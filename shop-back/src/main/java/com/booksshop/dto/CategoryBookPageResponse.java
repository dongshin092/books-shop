package com.booksshop.dto;

import java.util.List;

public record CategoryBookPageResponse(
        long totalCount,
        int page,
        int size,
        int totalPages,
        List<CategoryBookItemResponse> items
) {
}
