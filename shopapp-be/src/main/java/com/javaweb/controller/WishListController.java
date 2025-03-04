package com.javaweb.controller;

import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.product.ProductResponse;
import com.javaweb.service.WishListService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wish-list")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WishListController {
    WishListService wishListService;

    @GetMapping("/{userId}")
    public ApiResponse<PageResponse<ProductResponse>> getWishListByUser(
            @PathVariable String userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .result(wishListService.getWishListByUser(userId, page, size))
                .build();
    }

    @PostMapping("/{userId}/{productId}")
    public ApiResponse<Void> toggle(@PathVariable String userId, @PathVariable String productId) {
        wishListService.toggle(userId, productId);
        return ApiResponse.<Void>builder().build();
    }
}
