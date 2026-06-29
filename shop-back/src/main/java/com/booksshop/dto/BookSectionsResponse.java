package com.booksshop.dto;

import java.util.List;

public record BookSectionsResponse(
        List<BookSummaryResponse> bestTopN,
        List<BookSummaryResponse> newTopN,
        List<BookSummaryResponse> itTopN,
        List<BookSummaryResponse> novelTopN,
        List<BookSummaryResponse> selfTopN
) {
}
