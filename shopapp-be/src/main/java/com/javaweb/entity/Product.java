package com.javaweb.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

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
    int inventoryQuantity = 0;

    int soldQuantity = 0;

    int point = 0;

    @ManyToOne
    @JoinColumn(name = "category_id")
    Category category;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "discount_id")
    Discount discount;
}
