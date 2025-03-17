package com.NamVu.dto.response.order;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailResponse {
    String productId;
    String productCode;
    String productName;
    int quantity;
    Long priceAtPurchase;

    @JsonProperty("isReviewed")
    boolean isReviewed;
}
