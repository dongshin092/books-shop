package com.booksshop.service;

import com.booksshop.common.ErrorCode;
import com.booksshop.dto.CartsItemResponse;
import com.booksshop.entity.Carts;
import com.booksshop.exception.BusinessException;
import com.booksshop.repository.BookRepository;
import com.booksshop.repository.CartsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartsService {

    private static final int DEFAULT_QUANTITY = 1;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final CartsRepository cartsRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public List<CartsItemResponse> getItems(String userId) {
        return cartsRepository.findItemsByUserId(userId);
    }

    @Transactional
    public void changeQuantity(String userId, String itemId, Integer quantity) {
        Carts cart = cartsRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND));
        cart.changeQuantity(quantity);
    }

    @Transactional
    public void deleteItems(String userId, List<String> itemIds) {
        List<Carts> carts = cartsRepository.findByIdInAndUserId(itemIds, userId);
        cartsRepository.deleteAll(carts);
    }

    @Transactional
    public void addItem(String userId, String bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw new BusinessException(ErrorCode.BOOK_NOT_FOUND);
        }

        cartsRepository.findByUserIdAndBookId(userId, bookId)
                .ifPresentOrElse(
                        cart -> cart.increaseQuantity(DEFAULT_QUANTITY),
                        () -> cartsRepository.save(new Carts(generateId(), userId, bookId, DEFAULT_QUANTITY))
                );
    }

    private String generateId() {
        int randomDigits = 10_000_000 + RANDOM.nextInt(90_000_000);
        return "Item" + randomDigits;
    }
}
