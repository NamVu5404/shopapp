package com.NamVu.controller;

import com.NamVu.dto.request.review.ReviewRequest;
import com.NamVu.dto.response.ApiResponse;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.review.ReviewResponse;
import com.NamVu.service.ReviewService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {
    ReviewService reviewService;

    @PostMapping
    public ApiResponse<ReviewResponse> create(@RequestBody ReviewRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.create(request))
                .build();
    }

    @GetMapping("/product/{productId}")
    public ApiResponse<PageResponse<ReviewResponse>> getByProductId(
            @PathVariable(value = "productId") String productId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<ReviewResponse>>builder()
                .result(reviewService.getByProductId(productId, pageable))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        reviewService.delete(id);

        return ApiResponse.<Void>builder()
                .message("Delete successful")
                .build();
    }
}
