package com.booksshop.repository;

import com.booksshop.dto.BookSummaryResponse;
import com.booksshop.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, String> {

    @Query("""
            select new com.booksshop.dto.BookSummaryResponse(b.id, b.title, b.coverImage, b.author, b.salePrice)
            from Book b
            where b.bestYn = 'Y'
            order by b.publishedDate desc, b.title asc
            limit 5
            """)
    List<BookSummaryResponse> findBestTop5();

    @Query("""
            select new com.booksshop.dto.BookSummaryResponse(b.id, b.title, b.coverImage, b.author, b.salePrice)
            from Book b
            where b.newYn = 'Y'
            order by b.publishedDate desc, b.title asc
            limit 5
            """)
    List<BookSummaryResponse> findNewTop5();

    @Query("""
            select new com.booksshop.dto.BookSummaryResponse(b.id, b.title, b.coverImage, b.author, b.salePrice)
            from Book b join Category c on b.categoryId = c.id
            where c.types = :types
            order by b.publishedDate desc, b.title asc
            limit 5
            """)
    List<BookSummaryResponse> findTop5ByCategoryType(@Param("types") String types);
}
