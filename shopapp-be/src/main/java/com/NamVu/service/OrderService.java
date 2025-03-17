package com.NamVu.service;

import com.NamVu.dto.request.order.OrderRequest;
import com.NamVu.dto.request.order.OrderSearchRequest;
import com.NamVu.dto.request.order.OrderStatusRequest;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.order.OrderResponse;
import com.NamVu.enums.OrderStatus;
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
