package com.javaweb.service.impl;

import com.javaweb.constant.StatusConstant;
import com.javaweb.converter.ProductConverter;
import com.javaweb.dto.request.product.ProductCreateRequest;
import com.javaweb.dto.request.product.ProductSearchRequest;
import com.javaweb.dto.request.product.ProductUpdateRequest;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.product.ProductResponse;
import com.javaweb.entity.Product;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.ProductRepository;
import com.javaweb.service.ProductService;
import com.javaweb.specifications.ProductSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductServiceImpl implements ProductService {
    ProductRepository productRepository;
    ProductConverter productConverter;

    @Override
    public PageResponse<ProductResponse> search(ProductSearchRequest request, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "point")
                .and(Sort.by(Sort.Direction.DESC, "createdDate"))
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Specification<Product> spec = Specification
                .where(ProductSpecification.withId(request.getId()))
                .and(ProductSpecification.withCategoryCode(request.getCategoryCode()))
                .and(ProductSpecification.withSupplierCode(request.getSupplierCode()))
                .and(ProductSpecification.withCode(request.getCode()))
                .and(ProductSpecification.withName(request.getName()))
                .and(ProductSpecification.withMinPrice(request.getMinPrice()))
                .and(ProductSpecification.withMaxPrice(request.getMaxPrice()))
                .and(ProductSpecification.withIsActive(StatusConstant.ACTIVE));

        Page<Product> products = productRepository.findAll(spec, pageable);

        return PageResponse.<ProductResponse>builder()
                .totalPage(products.getTotalPages())
                .pageSize(size)
                .currentPage(page)
                .totalElements(products.getTotalElements())
                .data(products.stream().map(productConverter::toResponse).toList())
                .build();
    }

    @Override
    public ProductResponse getByCode(String code) {
        return productConverter.toResponse(productRepository
                .findByCodeAndIsActive(code, StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_EXISTS)));
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_PRODUCT')")
    public ProductResponse create(ProductCreateRequest request) {
        if (productRepository.existsByCode(request.getCode()))
            throw new CustomException(ErrorCode.PRODUCT_EXISTS);

        Product product = productConverter.toEntity(request);
        productRepository.save(product);

        return productConverter.toResponse(product);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_PRODUCT')")
    public ProductResponse update(String id, ProductUpdateRequest request) {
        Product existedProduct = productRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_EXISTS));

        Product updatedProduct = productConverter.toEntity(existedProduct, request);
        productRepository.save(updatedProduct);

        return productConverter.toResponse(updatedProduct);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_PRODUCT')")
    public void delete(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_EXISTS));

        product.setIsActive(StatusConstant.INACTIVE);
        productRepository.save(product);
    }
}
