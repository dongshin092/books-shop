package com.booksshop.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        UserInfo user
) {
    public static LoginResponse of(String accessToken, long expiresIn, UserInfo user) {
        return new LoginResponse(accessToken, "Bearer", expiresIn, user);
    }
}
