package com.javaweb.dto.response.inventoryReceipt;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryReceiptDetailResponse {
    String id;
    String productId;
    String productCode;
    int quantity;
    long price;
}
