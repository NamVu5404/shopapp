package com.javaweb.service.impl;

import com.javaweb.converter.OrderConverter;
import com.javaweb.dto.request.order.OrderRequest;
import com.javaweb.dto.request.order.OrderStatusRequest;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.order.OrderResponse;
import com.javaweb.entity.Order;
import com.javaweb.entity.OrderDetail;
import com.javaweb.entity.Product;
import com.javaweb.enums.OrderStatus;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.OrderRepository;
import com.javaweb.repository.ProductRepository;
import com.javaweb.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
    OrderRepository orderRepository;
    OrderConverter orderConverter;
    ProductRepository productRepository;

    @Override
    @Transactional
    public OrderResponse create(OrderRequest request) {
        Order order = orderConverter.toEntity(request);

        List<OrderDetail> details = orderConverter.toDetailEntity(order, request.getDetails());
        order.setOrderDetails(details);

        updateInventoryQuantity(details, false); // - inventory quantity

        orderRepository.save(order);
        return orderConverter.toResponse(order);
    }

    @Override
    public PageResponse<OrderResponse> getByUserId(String userId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Order> orders = orderRepository.findByUser_Id(userId, pageable);

        List<OrderResponse> orderResponses = orders.stream()
                .map(orderConverter::toResponse)
                .toList();

        return PageResponse.<OrderResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalElements(orders.getTotalElements())
                .totalPage(orders.getTotalPages())
                .data(orderResponses)
                .build();
    }

    @Override
    public OrderResponse getOneByOrderId(String orderId) {
        return orderRepository.findById(orderId)
                .map(orderConverter::toResponse)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_EXISTS));
    }

    @Override
    public PageResponse<OrderResponse> getByStatus(OrderStatus status, String userId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Order> orders = orderRepository.findByStatusAndUser_Id(status, userId, pageable);

        List<OrderResponse> orderResponses = orders.stream()
                .map(orderConverter::toResponse)
                .toList();

        return PageResponse.<OrderResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalElements(orders.getTotalElements())
                .totalPage(orders.getTotalPages())
                .data(orderResponses)
                .build();
    }

    @Override
    @Transactional
    public OrderResponse cancel(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_EXISTS));

        handleCancel(order);

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        return orderConverter.toResponse(order);
    }

    @Override
    public PageResponse<OrderResponse> getAll(int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Order> orders = orderRepository.findAll(pageable);

        List<OrderResponse> orderResponses = orders.stream()
                .map(orderConverter::toResponse)
                .toList();

        return PageResponse.<OrderResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalElements(orders.getTotalElements())
                .totalPage(orders.getTotalPages())
                .data(orderResponses)
                .build();
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(String orderId, OrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_EXISTS));

        switch (request.getStatus()) {
            case CANCELLED -> handleCancel(order);
            case CONFIRMED -> handleConfirm(order);
            case SHIPPING -> handleShipping(order);
            case COMPLETED -> handleCompleted(order);
            case FAILED -> handleFailed(order);
            default -> {
                throw new CustomException(ErrorCode.CAN_NOT_EDITABLE);
            }
        }

        order.setStatus(request.getStatus());
        orderRepository.save(order);
        return orderConverter.toResponse(order);
    }

    private void handleCancel(Order order) {
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new CustomException(ErrorCode.CAN_NOT_EDITABLE);
        }

        updateInventoryQuantity(order.getOrderDetails(), true); // + inventory quantity
    }

    private void handleConfirm(Order order) {
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new CustomException(ErrorCode.CAN_NOT_EDITABLE);
        }
    }

    private void handleShipping(Order order) {
        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new CustomException(ErrorCode.CAN_NOT_EDITABLE);
        }
    }

    private void handleCompleted(Order order) {
        if (order.getStatus() != OrderStatus.SHIPPING) {
            throw new CustomException(ErrorCode.CAN_NOT_EDITABLE);
        }

        updateSoldQuantity(order.getOrderDetails()); // + sold quantity
    }

    private void handleFailed(Order order) {
        if (order.getStatus() != OrderStatus.SHIPPING) {
            throw new CustomException(ErrorCode.CAN_NOT_EDITABLE);
        }

        updateInventoryQuantity(order.getOrderDetails(), true); // + inventory quantity
    }

    private void updateInventoryQuantity(List<OrderDetail> details, boolean isAddition) {
        List<Product> products = details.stream()
                .map(detail -> {
                    Product product = detail.getProduct();
                    product.setInventoryQuantity(product.getInventoryQuantity() +
                            (isAddition ? detail.getQuantity() : -detail.getQuantity()));

                    if (product.getInventoryQuantity() < 0) {
                        throw new CustomException(ErrorCode.INVENTORY_NOT_ENOUGH);
                    }
                    return product;
                })
                .toList();

        productRepository.saveAll(products);
    }

    private void updateSoldQuantity(List<OrderDetail> details) {
        List<Product> products = details.stream()
                .map(detail -> {
                    Product product = detail.getProduct();
                    product.setSoldQuantity(product.getSoldQuantity() + detail.getQuantity());
                    return product;
                })
                .toList();

        productRepository.saveAll(products);
    }
}
