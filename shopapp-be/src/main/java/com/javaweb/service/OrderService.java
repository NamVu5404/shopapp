package com.javaweb.service;

import com.javaweb.dto.request.order.OrderRequest;
import com.javaweb.dto.request.order.OrderSearchRequest;
import com.javaweb.dto.request.order.OrderStatusRequest;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.order.OrderResponse;
import com.javaweb.enums.OrderStatus;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    PageResponse<OrderResponse> search(OrderSearchRequest request, Pageable pageable);

    OrderResponse create(OrderRequest request);

    OrderResponse getOneByOrderId(String orderId);

    OrderResponse getByIdAndEmail(String id, String email);

    PageResponse<OrderResponse> getByUser(OrderStatus status, String userId, Pageable pageable);

    OrderResponse cancel(String orderId);

    PageResponse<OrderResponse> getAllByStatus(OrderStatus status, Pageable pageable);

    OrderResponse updateStatus(String orderId, OrderStatusRequest request);

    int countTotalPendingOrders();
}
