package com.javaweb.repository;

import com.javaweb.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, String> {
    boolean existsByOrderIdAndProductId(String orderId, String productId);
}
