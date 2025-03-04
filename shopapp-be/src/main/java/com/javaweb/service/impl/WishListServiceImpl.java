package com.javaweb.service.impl;

import com.javaweb.constant.StatusConstant;
import com.javaweb.converter.ProductConverter;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.product.ProductResponse;
import com.javaweb.entity.Product;
import com.javaweb.entity.User;
import com.javaweb.entity.WishList;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.ProductRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.repository.WishListRepository;
import com.javaweb.service.WishListService;
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
public class WishListServiceImpl implements WishListService {
    WishListRepository wishListRepository;
    ProductConverter productConverter;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public PageResponse<ProductResponse> getWishListByUser(String userId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<WishList> wishLists = wishListRepository.findByUserId(userId, pageable);

        List<ProductResponse> productResponses = wishLists.stream()
                .map(wishList -> productConverter.toResponse(wishList.getProduct()))
                .toList();

        return PageResponse.<ProductResponse>builder()
                .totalPage(wishLists.getTotalPages())
                .currentPage(page)
                .pageSize(size)
                .totalElements(wishLists.getTotalElements())
                .data(productResponses)
                .build();
    }

    @Override
    @Transactional
    public void toggle(String userId, String productId) {
        boolean exists = wishListRepository.existsByUser_IdAndProduct_Id(userId, productId);

        if (exists) {
            wishListRepository.deleteByUser_IdAndProduct_Id(userId, productId);
            return;
        }

        User user = userRepository.findByIdAndIsActive(userId, StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_EXISTS));

        wishListRepository.save(WishList.builder()
                .user(user)
                .product(product)
                .build());
    }
}
