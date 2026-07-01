package com.booksshop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Carts extends BaseEntity {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @Column(name = "book_id", length = 40, nullable = false)
    private String bookId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    public Carts(String id, String userId, String bookId, Integer quantity) {
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.quantity = quantity;
    }

    public void changeQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void increaseQuantity(Integer amount) {
        this.quantity += amount;
    }
}
