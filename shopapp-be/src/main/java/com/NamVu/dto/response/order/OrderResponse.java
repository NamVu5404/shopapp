package com.NamVu.dto.response.order;

import com.NamVu.enums.OrderStatus;
import com.NamVu.enums.OrderType;
import com.NamVu.enums.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    String userId;
    String username;
    String fullName;
    String phone;
    String address;
    LocalDateTime createdDate;
    List<OrderDetailResponse> details;

    @JsonProperty("isAllReviewed")
    boolean isAllReviewed;
}
