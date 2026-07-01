package com.booksshop.dto;

import java.util.List;

public record CartsListResponse(
        int code,
        List<CartsItemResponse> data
) {
    public static CartsListResponse of(List<CartsItemResponse> data) {
        return new CartsListResponse(200, data);
    }
}
