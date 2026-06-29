package com.booksshop.service;

import com.booksshop.dto.BookSectionsResponse;
import com.booksshop.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

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
}
