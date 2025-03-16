package com.javaweb.dto.response.report;

import com.javaweb.enums.OrderType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RevenueByOrderType {
    OrderType orderType;
    Long totalOrders;
    Long totalRevenue;
}
