package com.NamVu.service;

import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.product.ProductResponse;
import org.springframework.data.domain.Pageable;

public interface WishListService {
    PageResponse<ProductResponse> getWishListByUser(String userId, Pageable pageable);
    void toggle(String userId, String productId);
}
