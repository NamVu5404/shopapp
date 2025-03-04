package com.javaweb.controller;

import com.javaweb.dto.request.order.OrderRequest;
import com.javaweb.dto.request.order.OrderStatusRequest;
import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.order.OrderResponse;
import com.javaweb.enums.OrderStatus;
import com.javaweb.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Validated
public class OrderController {
    OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> create(@RequestBody @Valid OrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.create(request))
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<PageResponse<OrderResponse>> getByUserId(
            @PathVariable String userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .result(orderService.getByUserId(userId, page, size))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOneByOrderId(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOneByOrderId(id))
                .build();
    }

    @GetMapping("/status/{status}")
    public ApiResponse<PageResponse<OrderResponse>> getByStatus(
            @PathVariable OrderStatus status,
            @RequestParam(value = "userId") String userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .result(orderService.getByStatus(status, userId, page, size))
                .build();
    }

    @PutMapping("/{id}/cancel")
    public ApiResponse<OrderResponse> cancel(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.cancel(id))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<OrderResponse>> getAll(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .result(orderService.getAll(page, size))
                .build();
    }

    @PutMapping("/{id}/status")
    public ApiResponse<OrderResponse> updateStatus(@PathVariable String id, @RequestBody OrderStatusRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.updateStatus(id, request))
                .build();
    }
}
