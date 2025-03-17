package com.NamVu.repository;

import com.NamVu.entity.Order;
import com.NamVu.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {
    Page<Order> findByStatusAndUser_Id(OrderStatus status, String userId, Pageable pageable);

    Page<Order> findAllByStatus(OrderStatus status, Pageable pageable);

    Optional<Order> findByIdAndUser_Username(String id, String email);

    int countByStatus(OrderStatus status);
}
