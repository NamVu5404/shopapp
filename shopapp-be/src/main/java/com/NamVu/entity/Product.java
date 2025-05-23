package com.NamVu.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "product")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product extends BaseEntity {
    @Column(nullable = false, unique = true)
    String code;

    @Column(nullable = false)
    String name;

    @Lob // Large Object
    @Column(columnDefinition = "TEXT")
    String description;

    @Column(nullable = false)
    long price;

    Long discountPrice;

    @Column(nullable = false)
    int inventoryQuantity;

    int soldQuantity;

    double point;

    double avgRating = 2.5;

    int reviewCount;

    @ManyToOne
    @JoinColumn(name = "category_id")
    Category category;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "discount_id")
    Discount discount;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ProductImage> images;
}
