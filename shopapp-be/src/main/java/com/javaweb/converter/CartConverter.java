package com.javaweb.converter;

import com.javaweb.dto.response.cart.CartItemResponse;
import com.javaweb.dto.response.cart.CartResponse;
import com.javaweb.entity.Cart;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartConverter {

    public CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(item ->
                        CartItemResponse.builder()
                                .productId(item.getProduct().getId())
                                .productCode(item.getProduct().getCode())
                                .productName(item.getProduct().getName())
                                .price(item.getProduct().getPrice())
                                .discountPrice(item.getProduct().getDiscountPrice())
                                .quantity(item.getQuantity())
                                .build())
                .toList();

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .build();
    }
}
