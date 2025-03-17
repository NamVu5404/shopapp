package com.NamVu.service.impl;

import com.NamVu.constant.StatusConstant;
import com.NamVu.converter.OrderConverter;
import com.NamVu.dto.request.order.OrderRequest;
import com.NamVu.dto.request.order.OrderSearchRequest;
import com.NamVu.dto.request.order.OrderStatusRequest;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.order.OrderResponse;
import com.NamVu.entity.Order;
import com.NamVu.entity.OrderDetail;
import com.NamVu.entity.Product;
import com.NamVu.entity.User;
import com.NamVu.enums.OrderStatus;
import com.NamVu.exception.CustomException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.OrderRepository;
import com.NamVu.repository.ProductRepository;
import com.NamVu.repository.UserRepository;
import com.NamVu.service.OrderService;
import com.NamVu.specifications.OrderSpecification;
import com.NamVu.utils.AuthUtils;
import com.NamVu.utils.PointCalculator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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
    UserRepository userRepository;

    @Override
    public PageResponse<OrderResponse> search(OrderSearchRequest request, Pageable pageable) {
        Specification<Order> specification = Specification
                .where(OrderSpecification.withId(request.getId()))
                .and(OrderSpecification.withEmail(request.getEmail()))
                .and(OrderSpecification.withPhone(request.getPhone()))
                .and(OrderSpecification.withFullName(request.getFullName()))
                .and(OrderSpecification.withDateRange(request.getStartDate(), request.getEndDate()));

        Page<Order> orders = orderRepository.findAll(specification, pageable);

        List<OrderResponse> orderResponses = orders.stream()
                .map(orderConverter::toResponse)
                .toList();

        return PageResponse.<OrderResponse>builder()
                .currentPage(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .totalElements(orders.getTotalElements())
                .totalPage(orders.getTotalPages())
                .data(orderResponses)
                .build();
    }

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
    public OrderResponse getOneByOrderId(String orderId) {
        Order order = validatePermission(orderId);
        return orderConverter.toResponse(order);
    }

    @Override
    public OrderResponse getByIdAndEmail(String id, String email) {
        return orderConverter.toResponse(orderRepository
                .findByIdAndUser_Username(id, email)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_EXISTS)));
    }

    @Override
    public PageResponse<OrderResponse> getByUser(OrderStatus status, String userId, Pageable pageable) {
        // check valid permission
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User currentUser = userRepository.findByUsernameAndIsActive(currentUsername, StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        if (!userId.equals(currentUser.getId()) && !AuthUtils.hasPermission("RUD_ORDER")) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        //
        Page<Order> orders = orderRepository.findByStatusAndUser_Id(status, userId, pageable);

        List<OrderResponse> orderResponses = orders.stream()
                .map(orderConverter::toResponse)
                .toList();

        return PageResponse.<OrderResponse>builder()
                .currentPage(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .totalElements(orders.getTotalElements())
                .totalPage(orders.getTotalPages())
                .data(orderResponses)
                .build();
    }

    @Override
    @Transactional
    public OrderResponse cancel(String orderId) {
        Order order = validatePermission(orderId);

        handleCancel(order);

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        return orderConverter.toResponse(order);
    }

    @Override
    @PreAuthorize("hasAuthority('RUD_ORDER')")
    public PageResponse<OrderResponse> getAllByStatus(OrderStatus status, Pageable pageable) {
        Page<Order> orders = orderRepository.findAllByStatus(status, pageable);

        List<OrderResponse> orderResponses = orders.stream()
                .map(orderConverter::toResponse)
                .toList();

        return PageResponse.<OrderResponse>builder()
                .currentPage(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .totalElements(orders.getTotalElements())
                .totalPage(orders.getTotalPages())
                .data(orderResponses)
                .build();
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('RUD_ORDER')")
    public OrderResponse updateStatus(String orderId, OrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_EXISTS));

        switch (request.getStatus()) {
            case CANCELLED:
                handleCancel(order);
                break;
            case CONFIRMED:
                handleConfirm(order);
                break;
            case SHIPPING:
                handleShipping(order);
                break;
            case COMPLETED:
                handleCompleted(order);
                break;
            case FAILED:
                handleFailed(order);
                break;
            default:
                throw new CustomException(ErrorCode.CAN_NOT_EDITABLE);
        }

        order.setStatus(request.getStatus());
        orderRepository.save(order);
        return orderConverter.toResponse(order);
    }

    @Override
    public int countTotalPendingOrders() {
        return orderRepository.countByStatus(OrderStatus.PENDING);
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
        updateProductPoint(order.getOrderDetails());
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

    private void updateProductPoint(List<OrderDetail> details) {
        List<Product> products = details.stream()
                .map(detail -> {
                    Product product = detail.getProduct();
                    double point = PointCalculator.calculatePoint(product.getSoldQuantity(),
                            product.getAvgRating(), product.getReviewCount());
                    product.setPoint(point);
                    return product;
                })
                .toList();

        productRepository.saveAll(products);
    }

    private Order validatePermission(String orderId) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User currentUser = userRepository.findByUsernameAndIsActive(currentUsername, StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_EXISTS));

        if (!order.getUser().getId().equals(currentUser.getId()) && !AuthUtils.hasPermission("RUD_ORDER")) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        return order;
    }
}
