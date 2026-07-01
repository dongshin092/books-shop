package com.booksshop.dto;

public record CartsResultResponse(
        int code,
        String message
) {
    public static CartsResultResponse of(String message) {
        return new CartsResultResponse(200, message);
    }
}
