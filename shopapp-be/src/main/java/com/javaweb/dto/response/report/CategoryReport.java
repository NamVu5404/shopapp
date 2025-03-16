package com.javaweb.dto.response.report;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryReport {
    String categoryName;
    long totalSoldQuantity;
    long totalRevenue;
}
