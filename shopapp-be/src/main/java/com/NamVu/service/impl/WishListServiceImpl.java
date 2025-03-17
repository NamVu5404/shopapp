package com.NamVu.service.impl;

import com.NamVu.constant.StatusConstant;
import com.NamVu.converter.ProductConverter;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.product.ProductResponse;
import com.NamVu.entity.Product;
import com.NamVu.entity.User;
import com.NamVu.entity.WishList;
import com.NamVu.exception.CustomException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.ProductRepository;
import com.NamVu.repository.UserRepository;
import com.NamVu.repository.WishListRepository;
import com.NamVu.service.WishListService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public PageResponse<ProductResponse> getWishListByUser(String userId, Pageable pageable) {
        Page<WishList> wishLists = wishListRepository.findByUserId(userId, pageable);

        List<ProductResponse> productResponses = wishLists.stream()
                .map(wishList -> productConverter.toResponse(wishList.getProduct()))
                .toList();

        return PageResponse.<ProductResponse>builder()
                .totalPage(wishLists.getTotalPages())
                .currentPage(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
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
