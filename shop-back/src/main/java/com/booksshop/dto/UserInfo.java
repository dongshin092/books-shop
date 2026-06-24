package com.booksshop.dto;

import com.booksshop.entity.User;

public record UserInfo(
        String userId,
        String names,
        String roles
) {
    public static UserInfo from(User user) {
        return new UserInfo(user.getUserId(), user.getNames(), user.getRoles());
    }
}
