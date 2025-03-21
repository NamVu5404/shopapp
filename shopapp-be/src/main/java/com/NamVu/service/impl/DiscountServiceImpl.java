package com.NamVu.service.impl;

import com.NamVu.dto.request.product.DiscountProductRequest;
import com.NamVu.entity.Discount;
import com.NamVu.entity.Product;
import com.NamVu.exception.AppException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.DiscountRepository;
import com.NamVu.repository.ProductRepository;
import com.NamVu.service.DiscountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class DiscountServiceImpl implements DiscountService {
    DiscountRepository discountRepository;
    ProductRepository productRepository;
    ModelMapper modelMapper;

    @Override
    public List<Discount> getAll() {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate");
        return discountRepository.findAll(sort);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_DISCOUNT')")
    public Discount create(Discount discount) {
        log.info("discount: {}", discount);
        return discountRepository.save(discount);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_DISCOUNT')")
    public Discount update(String id, Discount request) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_EXISTED));

        List<Product> products = discount.getProducts().stream()
                .peek(product -> {
                    product.setDiscount(discount);
                    product.setDiscountPrice(Math.round(product.getPrice()
                            * (100 - request.getPercent()) / 100.0));
                })
                .collect(Collectors.toList());

        discount.setProducts(products);

        modelMapper.map(request, discount);
        return discountRepository.save(discount);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_DISCOUNT')")
    public Discount addDiscountProducts(String id, DiscountProductRequest request) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_EXISTED));

        // Lấy danh sách mới từ request
        List<Product> products = request.getProductIds().stream()
                .map(pid -> productRepository.findById(pid)
                        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED)))
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
    @PreAuthorize("hasAuthority('CUD_DISCOUNT')")
    public void delete(String id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_EXISTED));

        discount.getProducts().forEach(product -> {
            product.setDiscount(null);
            product.setDiscountPrice(null);
        });
        productRepository.saveAll(discount.getProducts());

        discountRepository.delete(discount);
    }
}
