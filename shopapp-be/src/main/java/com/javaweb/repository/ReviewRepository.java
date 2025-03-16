package com.javaweb.repository;

import com.javaweb.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, String> {
    boolean existsByUserIdAndOrderIdAndProductId(String userId, String orderId, String productId);

    Page<Review> findByProductIdAndIsActive(String productId, byte isActive, Pageable pageable);
}
