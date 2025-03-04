package com.javaweb.dto.request.inventoryReceipt;

import com.javaweb.enums.ReceiptStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InventoryStatusRequest {
    ReceiptStatus status;
}
