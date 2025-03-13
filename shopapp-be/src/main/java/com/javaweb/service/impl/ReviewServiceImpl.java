package com.javaweb.service.impl;

import com.javaweb.constant.StatusConstant;
import com.javaweb.dto.request.review.ReviewRequest;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.review.ReviewResponse;
import com.javaweb.entity.Order;
import com.javaweb.entity.Product;
import com.javaweb.entity.Review;
import com.javaweb.entity.User;
import com.javaweb.enums.OrderStatus;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.*;
import com.javaweb.service.ReviewService;
import com.javaweb.utils.PointCalculator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewServiceImpl implements ReviewService {
    ReviewRepository reviewRepository;
    OrderRepository orderRepository;
    OrderDetailRepository orderDetailRepository;
    UserRepository userRepository;
    ProductRepository productRepository;

    @Override
    @Transactional
    public ReviewResponse create(ReviewRequest request) {
        Order order = validateOrderAndUser(request);
        validateProductInOrder(request);
        validateReviewNotExists(request);

        Review review = createReviewFromRequest(request, order);
        reviewRepository.save(review);

        updateProductRatingAndPoint(review.getProduct().getId(), review.getRating());

        return mapToResponse(review);
    }

    @Override
    public PageResponse<ReviewResponse> getByProductId(String productId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);

        List<ReviewResponse> reviewResponses = reviews.stream()
                .map(this::mapToResponse)
                .toList();

        return PageResponse.<ReviewResponse>builder()
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalPage(reviews.getTotalPages())
                .totalElements(reviews.getTotalElements())
                .data(reviewResponses)
                .build();
    }

    private Order validateOrderAndUser(ReviewRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_EXISTS));

        if (!order.getUser().getId().equals(request.getUserId())) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new CustomException(ErrorCode.CAN_NOT_REVIEW);
        }

        return order;
    }

    private void validateProductInOrder(ReviewRequest request) {
        boolean productInOrder = orderDetailRepository
                .existsByOrderIdAndProductId(request.getOrderId(), request.getProductId());
        if (!productInOrder) {
            throw new CustomException(ErrorCode.PRODUCT_NOT_IN_ORDER);
        }
    }

    private void validateReviewNotExists(ReviewRequest request) {
        if (reviewRepository.existsByUserIdAndOrderIdAndProductId(
                request.getUserId(), request.getOrderId(), request.getProductId())) {
            throw new CustomException(ErrorCode.ALREADY_REVIEWED);
        }
    }

    private Review createReviewFromRequest(ReviewRequest request, Order order) {
        User user = userRepository.findByIdAndIsActive(request.getUserId(), StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_EXISTS));

        return Review.builder()
                .user(user)
                .product(product)
                .order(order)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
    }

    /**
     * Cập nhật đánh giá trung bình và điểm cho sản phẩm sau khi có review mới.
     *
     * @param productId ID của sản phẩm
     * @param newRating Điểm đánh giá mới
     */
    private void updateProductRatingAndPoint(String productId, int newRating) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_EXISTS));

        // Cập nhật avgRating theo công thức tăng dần
        int reviewCount = product.getReviewCount();
        double currentAvgRating = product.getAvgRating();
        double newAvgRating = reviewCount == 0 ? newRating :
                (currentAvgRating * reviewCount + newRating) / (reviewCount + 1);

        product.setAvgRating(newAvgRating);
        product.setReviewCount(reviewCount + 1);

        // Tính lại point với soldQuantity và avgRating mới
        double point = PointCalculator
                .calculatePoint(product.getSoldQuantity(), newAvgRating, product.getReviewCount());
        product.setPoint(point);

        productRepository.save(product);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .userId(review.getUser().getId())
                .fullName(review.getUser().getFullName())
                .orderId(review.getOrder().getId())
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdDate(review.getCreatedDate())
                .build();
    }
}
