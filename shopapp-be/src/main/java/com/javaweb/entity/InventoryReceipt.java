package com.javaweb.entity;

import com.javaweb.enums.ReceiptStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "inventory_receipt")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryReceipt extends BaseEntity {
    @Column(nullable = false)
    long totalAmount;

    @Enumerated(EnumType.STRING)
    ReceiptStatus status;

    String note;

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    List<InventoryReceiptDetail> details;
}