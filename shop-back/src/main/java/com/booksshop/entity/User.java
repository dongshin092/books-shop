package com.booksshop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {

    @Id
    @Column(name = "user_id", length = 100)
    private String userId;

    @Column(name = "passwd", length = 200, nullable = false)
    private String passwd;

    @Column(name = "names", length = 50, nullable = false)
    private String names;

    @Column(name = "birth", length = 10, nullable = false)
    private String birth;

    @Column(name = "gender", length = 10, nullable = false)
    private String gender;

    @Column(name = "phone", length = 20, nullable = false)
    private String phone;

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "address", length = 300, nullable = false)
    private String address;

    @Column(name = "addr_detail", length = 300)
    private String addrDetail;

    @Column(name = "post_code", length = 10, nullable = false)
    private String postCode;

    @Column(name = "roles", length = 10, nullable = false)
    private String roles;
}
