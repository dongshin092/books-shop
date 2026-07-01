package com.booksshop.repository;

import com.booksshop.dto.CartsItemResponse;
import com.booksshop.entity.Carts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartsRepository extends JpaRepository<Carts, String> {

    @Query("""
            select new com.booksshop.dto.CartsItemResponse(
                c.id, b.id, b.title, b.author, b.publisher, b.salePrice, c.quantity)
            from Carts c join Book b on c.bookId = b.id
            where c.userId = :userId
            order by c.createdAt desc
            """)
    List<CartsItemResponse> findItemsByUserId(@Param("userId") String userId);

    Optional<Carts> findByIdAndUserId(String id, String userId);

    Optional<Carts> findByUserIdAndBookId(String userId, String bookId);

    List<Carts> findByIdInAndUserId(List<String> ids, String userId);
}
