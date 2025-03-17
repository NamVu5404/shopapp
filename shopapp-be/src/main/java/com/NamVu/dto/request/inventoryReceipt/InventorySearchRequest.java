package com.NamVu.dto.request.inventoryReceipt;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InventorySearchRequest {
    String id;
    String email;
    LocalDate startDate;
    LocalDate endDate;
}
