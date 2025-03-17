package com.NamVu.dto.response.report;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSummary {
    long totalOrders;
    long totalRevenue;
    long totalInventoryPrice;
}
