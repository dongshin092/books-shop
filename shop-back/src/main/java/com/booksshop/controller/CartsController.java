package com.booksshop.controller;

import com.booksshop.dto.CartsCreateRequest;
import com.booksshop.dto.CartsListResponse;
import com.booksshop.dto.CartsResultResponse;
import com.booksshop.dto.CartsUpdateRequest;
import com.booksshop.service.CartsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartsController {

    private final CartsService cartsService;

    @GetMapping
    public CartsListResponse getCarts(@AuthenticationPrincipal String userId) {
        return CartsListResponse.of(cartsService.getItems(userId));
    }

    @PutMapping
    public CartsResultResponse updateQuantity(
            @AuthenticationPrincipal String userId,
            @RequestBody @Valid CartsUpdateRequest request) {
        cartsService.changeQuantity(userId, request.itemId(), request.quantity());
        return CartsResultResponse.of("수량 변경 완료");
    }

    @DeleteMapping
    public CartsResultResponse deleteCarts(
            @AuthenticationPrincipal String userId,
            @RequestParam String items) {
        cartsService.deleteItems(userId, List.of(items.split(",")));
        return CartsResultResponse.of("삭제 완료");
    }

    @PostMapping
    public CartsResultResponse addCart(
            @AuthenticationPrincipal String userId,
            @RequestBody @Valid CartsCreateRequest request) {
        cartsService.addItem(userId, request.bookId());
        return CartsResultResponse.of("장바구니 담기 완료");
    }
}
