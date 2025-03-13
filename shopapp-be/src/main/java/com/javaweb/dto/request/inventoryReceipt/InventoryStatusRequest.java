package com.javaweb.dto.request.inventoryReceipt;

import com.javaweb.enums.InventoryStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InventoryStatusRequest {
    InventoryStatus status;
}
