package com.javaweb.service;

import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.product.ProductResponse;

public interface WishListService {
    PageResponse<ProductResponse> getWishListByUser(String userId, int page, int size);
    void toggle(String userId, String productId);
}
