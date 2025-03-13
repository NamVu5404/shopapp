package com.javaweb.service;

import com.javaweb.dto.request.cart.CartItemRequest;
import com.javaweb.dto.response.cart.CartResponse;

public interface CartService {
    int getTotalItems(String userId);
    CartResponse getCartByUser(String userId);
    void clearCart(String userId);
    CartResponse addCartItem(CartItemRequest request);
    void removeItem(String userId, String productId);
}
