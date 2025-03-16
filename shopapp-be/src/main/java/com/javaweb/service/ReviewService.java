package com.javaweb.service;

import com.javaweb.dto.request.review.ReviewRequest;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.review.ReviewResponse;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponse create(ReviewRequest request);

    PageResponse<ReviewResponse> getByProductId(String productId, Pageable pageable);

    void delete(String id);
}
