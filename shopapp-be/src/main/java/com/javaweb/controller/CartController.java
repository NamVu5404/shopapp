package com.javaweb.controller;

import com.javaweb.dto.request.cart.CartItemRequest;
import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.cart.CartResponse;
import com.javaweb.service.CartService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {
    CartService cartService;

    @GetMapping("/{userId}")
    public ApiResponse<CartResponse> getCartByUser(@PathVariable String userId) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.getCartByUser(userId))
                .build();
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<Void> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);

        return ApiResponse.<Void>builder()
                .message("Clear cart successful")
                .build();
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addCartItem(@RequestBody @Valid CartItemRequest request) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.addCartItem(request))
                .build();
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public ApiResponse<Void> removeItem(@PathVariable String userId,
                                        @PathVariable String productId) {
        cartService.removeItem(userId, productId);

        return ApiResponse.<Void>builder()
                .message("Clear cart item successful")
                .build();
    }
}
