package com.NamVu.controller;

import com.NamVu.dto.request.order.OrderRequest;
import com.NamVu.dto.request.order.OrderSearchRequest;
import com.NamVu.dto.request.order.OrderStatusRequest;
import com.NamVu.dto.response.ApiResponse;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.order.OrderResponse;
import com.NamVu.enums.OrderStatus;
import com.NamVu.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Validated
public class OrderController {
    OrderService orderService;

    @GetMapping
    public ApiResponse<PageResponse<OrderResponse>> search(
            OrderSearchRequest request,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .result(orderService.search(request, pageable))
                .build();
    }

    @PostMapping
    public ApiResponse<OrderResponse> create(@RequestBody @Valid OrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.create(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOneByOrderId(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOneByOrderId(id))
                .build();
    }

    @GetMapping("/check")
    public ApiResponse<OrderResponse> getByIdAndEmail(@RequestParam String id, @RequestParam String email) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getByIdAndEmail(id, email))
                .build();
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ApiResponse<PageResponse<OrderResponse>> getByUser(
            @PathVariable(value = "status") OrderStatus status,
            @PathVariable(value = "userId") String userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .result(orderService.getByUser(status, userId, pageable))
                .build();
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<OrderResponse> cancel(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.cancel(id))
                .build();
    }

    @GetMapping("/status/{status}")
    public ApiResponse<PageResponse<OrderResponse>> getAllByStatus(
            @PathVariable OrderStatus status,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .result(orderService.getAllByStatus(status, pageable))
                .build();
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<OrderResponse> updateStatus(@PathVariable String id, @RequestBody OrderStatusRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.updateStatus(id, request))
                .build();
    }

    @GetMapping("/status/PENDING/count")
    public ApiResponse<Integer> countTotalPendingOrders() {
        return ApiResponse.<Integer>builder()
                .result(orderService.countTotalPendingOrders())
                .build();
    }
}
