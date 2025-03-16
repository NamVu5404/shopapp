package com.javaweb.dto.response.report;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserGrowthRate {
    int weekOfYear;
    int year;
    Long newUsers;
}
