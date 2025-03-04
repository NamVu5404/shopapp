package com.javaweb.service.impl;

import com.javaweb.dto.request.product.DiscountProductRequest;
import com.javaweb.entity.Discount;
import com.javaweb.entity.Product;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.DiscountRepository;
import com.javaweb.repository.ProductRepository;
import com.javaweb.service.DiscountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DiscountServiceImpl implements DiscountService {
    DiscountRepository discountRepository;
    ProductRepository productRepository;

    @Override
    public List<Discount> getAll() {
        return discountRepository.findAll();
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public Discount createOrUpdate(Discount discount) {
        return discountRepository.save(discount);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ADD_DISCOUNT')")
    public Discount addDiscountProducts(String id, DiscountProductRequest request) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.DISCOUNT_NOT_EXISTS));

        // Lấy danh sách mới từ request
        List<Product> products = request.getProductIds().stream()
                .map(pid -> productRepository.findById(pid)
                        .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_EXISTS)))
                .collect(Collectors.toList());

        // Thiết lập quan hệ ngược lại và cập nhật danh sách mới và
        products.forEach(product -> {
            product.setDiscount(discount);
            product.setDiscountPrice(Math.round(product.getPrice()
                    * (100 - product.getDiscount().getPercent()) / 100.0));
        });
        discount.setProducts(products);

        return discountRepository.save(discount);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.DISCOUNT_NOT_EXISTS));

        discount.getProducts().forEach(product -> {
            product.setDiscount(null);
            product.setDiscountPrice(null);
        });
        productRepository.saveAll(discount.getProducts());

        discountRepository.delete(discount);
    }
}
