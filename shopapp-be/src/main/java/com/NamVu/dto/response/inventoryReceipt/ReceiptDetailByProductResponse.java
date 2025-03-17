package com.NamVu.dto.response.inventoryReceipt;

import com.NamVu.enums.InventoryStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReceiptDetailByProductResponse extends InventoryReceiptDetailResponse {
    String receiptId;
    InventoryStatus status;
    LocalDateTime createdDate;
    String createdBy;
    LocalDateTime modifiedDate;
    String modifiedBy;
}
