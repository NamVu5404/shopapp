package com.javaweb.dto.response.order;

import com.javaweb.enums.OrderStatus;
import com.javaweb.enums.OrderType;
import com.javaweb.enums.PaymentMethod;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    String id;
    OrderStatus status;
    OrderType orderType;
    Long totalPrice;
    PaymentMethod paymentMethod;
    String note;
    String username;
    String fullName;
    String phone;
    String address;
    LocalDateTime createdDate;
    List<OrderDetailResponse> details;
}
