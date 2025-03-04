package com.javaweb.service;

import com.javaweb.dto.request.order.OrderRequest;
import com.javaweb.dto.request.order.OrderStatusRequest;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.order.OrderResponse;
import com.javaweb.enums.OrderStatus;

public interface OrderService {
    OrderResponse create(OrderRequest request);

    PageResponse<OrderResponse> getByUserId(String userId, int page, int size);

    OrderResponse getOneByOrderId(String orderId);

    PageResponse<OrderResponse> getByStatus(OrderStatus status, String userId, int page, int size);

    OrderResponse cancel(String orderId);

    PageResponse<OrderResponse> getAll(int page, int size);

    OrderResponse updateStatus(String orderId, OrderStatusRequest request);
}
