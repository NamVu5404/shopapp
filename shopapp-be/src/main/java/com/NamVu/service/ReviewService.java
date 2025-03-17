package com.NamVu.service;

import com.NamVu.dto.request.review.ReviewRequest;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.review.ReviewResponse;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponse create(ReviewRequest request);

    PageResponse<ReviewResponse> getByProductId(String productId, Pageable pageable);

    void delete(String id);
}
