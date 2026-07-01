package com.booksshop.repository;

import com.booksshop.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByBookIdOrderByReviewDateDesc(String bookId, Pageable pageable);

    long countByBookId(String bookId);
}
