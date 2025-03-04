package com.javaweb.dto.request.order;

import com.javaweb.enums.OrderStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OrderStatusRequest {
    OrderStatus status;
}
