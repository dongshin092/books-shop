package com.booksshop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "books")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Book extends BaseEntity {

    @Id
    @Column(name = "id", length = 40)
    private String id;

    @Column(name = "category_id", length = 36, nullable = false)
    private String categoryId;

    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @Column(name = "subtitle", length = 200)
    private String subtitle;

    @Column(name = "author", length = 100)
    private String author;

    @Column(name = "publisher", length = 100)
    private String publisher;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(name = "list_price")
    private Integer listPrice;

    @Column(name = "sale_price")
    private Integer salePrice;

    @Column(name = "stocks", nullable = false)
    private Integer stocks;

    @Column(name = "page_count")
    private Integer pageCount;

    @Column(name = "published_date")
    private LocalDate publishedDate;

    @Column(name = "edition", length = 50)
    private String edition;

    @Column(name = "best_yn", columnDefinition = "bpchar", nullable = false)
    private String bestYn;

    @Column(name = "new_yn", columnDefinition = "bpchar", nullable = false)
    private String newYn;
}
