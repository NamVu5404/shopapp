package com.NamVu.converter;

import com.NamVu.constant.StatusConstant;
import com.NamVu.dto.request.order.OrderDetailRequest;
import com.NamVu.dto.request.order.OrderRequest;
import com.NamVu.dto.response.order.OrderDetailResponse;
import com.NamVu.dto.response.order.OrderResponse;
import com.NamVu.entity.Address;
import com.NamVu.entity.Order;
import com.NamVu.entity.OrderDetail;
import com.NamVu.entity.Product;
import com.NamVu.enums.OrderStatus;
import com.NamVu.exception.CustomException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.AddressRepository;
import com.NamVu.repository.ProductRepository;
import com.NamVu.repository.ReviewRepository;
import com.NamVu.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderConverter {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Order toEntity(OrderRequest request) {
        Order order = modelMapper.map(request, Order.class);

        order.setStatus(OrderStatus.PENDING);

        order.setUser(userRepository.findByIdAndIsActive(request.getUserId(), StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS)));

        order.setAddress(addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new CustomException(ErrorCode.ADDRESS_NOT_EXISTS)));

        return order;
    }

    public List<OrderDetail> toDetailEntity(Order order, List<OrderDetailRequest> details) {
        return details.stream()
                .map(detailRequest -> {
                    Product product = productRepository.findById(detailRequest.getProductId())
                            .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_EXISTS));

                    return OrderDetail.builder()
                            .order(order)
                            .product(product)
                            .quantity(detailRequest.getQuantity())
                            .priceAtPurchase(detailRequest.getPriceAtPurchase())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public OrderResponse toResponse(Order order) {
        OrderResponse response = modelMapper.map(order, OrderResponse.class);

        response.setUserId(order.getUser().getId());
        response.setUsername(order.getUser().getUsername());
        response.setFullName(order.getAddress().getFullName());
        response.setPhone(order.getAddress().getPhone());
        response.setAddress(buildAddress(order.getAddress()));

        List<OrderDetailResponse> details = order.getOrderDetails().stream()
                .map(orderDetail ->
                        OrderDetailResponse.builder()
                                .productId(orderDetail.getProduct().getId())
                                .productCode(orderDetail.getProduct().getCode())
                                .productName(orderDetail.getProduct().getName())
                                .quantity(orderDetail.getQuantity())
                                .priceAtPurchase(orderDetail.getPriceAtPurchase())
                                .isReviewed(reviewRepository.existsByUserIdAndOrderIdAndProductId(
                                        order.getUser().getId(),
                                        order.getId(),
                                        orderDetail.getProduct().getId()
                                ))
                                .build())
                .toList();

        boolean isAllReviewed = details.stream().allMatch(OrderDetailResponse::isReviewed);
        response.setAllReviewed(isAllReviewed);
        response.setDetails(details);

        return response;
    }

    private String buildAddress(Address address) {
        return address.getDetail() + ", " +
                address.getWard() + ", " +
                address.getDistrict() + ", " +
                address.getProvince();
    }
}
