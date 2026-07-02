package com.booksshop.service;

import com.booksshop.common.ErrorCode;
import com.booksshop.dto.BookDetailResponse;
import com.booksshop.dto.BookSectionsResponse;
import com.booksshop.dto.CategoryBookItemResponse;
import com.booksshop.dto.CategoryBookPageResponse;
import com.booksshop.dto.CategoryBookRow;
import com.booksshop.dto.ReviewItemResponse;
import com.booksshop.dto.ReviewPageResponse;
import com.booksshop.entity.Book;
import com.booksshop.entity.Category;
import com.booksshop.exception.BusinessException;
import com.booksshop.repository.BookRepository;
import com.booksshop.repository.CategoryRepository;
import com.booksshop.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookService {

    private static final Set<String> VALID_CATEGORY_TYPES = Set.of("IT", "NOVEL", "SELF");

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public BookSectionsResponse getMainSections() {
        return new BookSectionsResponse(
                bookRepository.findBestTop5(),
                bookRepository.findNewTop5(),
                bookRepository.findTop5ByCategoryType("IT"),
                bookRepository.findTop5ByCategoryType("NOVEL"),
                bookRepository.findTop5ByCategoryType("SELF")
        );
    }

    @Transactional(readOnly = true)
    public BookDetailResponse getBookDetail(String bookId, int page, int size) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOOK_NOT_FOUND));

        String categoryName = categoryRepository.findById(book.getCategoryId())
                .map(Category::getName)
                .orElse(null);

        Page<com.booksshop.entity.Review> reviewPage = reviewRepository
                .findByBookIdOrderByReviewDateDesc(bookId, PageRequest.of(page, size));

        List<ReviewItemResponse> items = reviewPage.getContent().stream()
                .map(ReviewItemResponse::from)
                .toList();

        int totalPages = (int) Math.ceil((double) reviewPage.getTotalElements() / size);

        ReviewPageResponse reviewList = new ReviewPageResponse(
                reviewPage.getTotalElements(),
                page,
                size,
                totalPages,
                items
        );

        return BookDetailResponse.of(book, categoryName, reviewList);
    }

    @Transactional(readOnly = true)
    public CategoryBookPageResponse getCategoryBooks(String types, int page, int size, String orderType) {
        if (!VALID_CATEGORY_TYPES.contains(types)) {
            throw new BusinessException(ErrorCode.INVALID_CATEGORY_TYPE);
        }

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<CategoryBookRow> rows = switch (orderType) {
            case "lower" -> bookRepository.findByCategoryTypeOrderByPriceLow(types, pageRequest);
            case "high" -> bookRepository.findByCategoryTypeOrderByPriceHigh(types, pageRequest);
            case "reviewCnt" -> bookRepository.findByCategoryTypeOrderByReviewCount(types, pageRequest);
            default -> bookRepository.findByCategoryTypeOrderByNew(types, pageRequest);
        };

        List<CategoryBookItemResponse> items = rows.getContent().stream()
                .map(CategoryBookItemResponse::from)
                .toList();

        return new CategoryBookPageResponse(
                rows.getTotalElements(),
                page,
                size,
                rows.getTotalPages(),
                items
        );
    }
}
