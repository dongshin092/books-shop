package com.booksshop.service;

import com.booksshop.common.ErrorCode;
import com.booksshop.dto.BookDetailResponse;
import com.booksshop.dto.BookSectionsResponse;
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

@Service
@RequiredArgsConstructor
public class BookService {

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
}
