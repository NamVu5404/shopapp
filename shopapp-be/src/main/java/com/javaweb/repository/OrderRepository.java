package com.javaweb.repository;

import com.javaweb.entity.Order;
import com.javaweb.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, String> {
    Page<Order> findByUser_Id(String userId, Pageable pageable);

    Page<Order> findByStatusAndUser_Id(OrderStatus status, String userId, Pageable pageable);
}
