package com.javaweb.dto.response.inventoryReceipt;

import com.javaweb.enums.InventoryStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryReceiptResponse {
    String id;
    long totalAmount;
    InventoryStatus status;
    String note;
    LocalDateTime createdDate;
    String createdBy;
    LocalDateTime modifiedDate;
    String modifiedBy;
    List<InventoryReceiptDetailResponse> detailResponses;
}
