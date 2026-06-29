package com.booksshop.controller;

import com.booksshop.common.ApiResponse;
import com.booksshop.dto.BookSectionsResponse;
import com.booksshop.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ApiResponse<BookSectionsResponse> getMainSections() {
        return ApiResponse.ok(bookService.getMainSections());
    }
}
