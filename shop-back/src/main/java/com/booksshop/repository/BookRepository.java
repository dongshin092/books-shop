package com.booksshop.repository;

import com.booksshop.dto.BookSummaryResponse;
import com.booksshop.dto.CategoryBookRow;
import com.booksshop.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    String CATEGORY_BOOK_ROW_SELECT = """
            select new com.booksshop.dto.CategoryBookRow(
                b.id, b.title, b.subtitle, b.author, b.publisher, b.publishedDate,
                b.coverImage, b.listPrice, b.salePrice,
                (select avg(r.rating) * 2 from Review r where r.bookId = b.id),
                (select count(r) from Review r where r.bookId = b.id),
                b.bestYn, b.newYn
            )
            from Book b join Category c on b.categoryId = c.id
            where c.types = :types
            """;

    String CATEGORY_BOOK_COUNT = """
            select count(b)
            from Book b join Category c on b.categoryId = c.id
            where c.types = :types
            """;

    @Query(value = CATEGORY_BOOK_ROW_SELECT + "order by b.publishedDate desc, b.title asc",
            countQuery = CATEGORY_BOOK_COUNT)
    Page<CategoryBookRow> findByCategoryTypeOrderByNew(@Param("types") String types, Pageable pageable);

    @Query(value = CATEGORY_BOOK_ROW_SELECT + "order by b.salePrice asc",
            countQuery = CATEGORY_BOOK_COUNT)
    Page<CategoryBookRow> findByCategoryTypeOrderByPriceLow(@Param("types") String types, Pageable pageable);

    @Query(value = CATEGORY_BOOK_ROW_SELECT + "order by b.salePrice desc",
            countQuery = CATEGORY_BOOK_COUNT)
    Page<CategoryBookRow> findByCategoryTypeOrderByPriceHigh(@Param("types") String types, Pageable pageable);

    @Query(value = CATEGORY_BOOK_ROW_SELECT
            + "order by (select count(r) from Review r where r.bookId = b.id) desc",
            countQuery = CATEGORY_BOOK_COUNT)
    Page<CategoryBookRow> findByCategoryTypeOrderByReviewCount(@Param("types") String types, Pageable pageable);
}
