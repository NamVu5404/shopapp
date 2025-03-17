package com.NamVu.controller;

import com.NamVu.dto.response.ApiResponse;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.product.ProductResponse;
import com.NamVu.service.WishListService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .result(wishListService.getWishListByUser(userId, pageable))
                .build();
    }

    @PostMapping("/{userId}/{productId}")
    public ApiResponse<Void> toggle(@PathVariable String userId, @PathVariable String productId) {
        wishListService.toggle(userId, productId);
        return ApiResponse.<Void>builder().build();
    }
}
