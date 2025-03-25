package com.NamVu.service.impl;

import com.NamVu.constant.StatusConstant;
import com.NamVu.converter.ProductConverter;
import com.NamVu.dto.request.product.ProductCreateRequest;
import com.NamVu.dto.request.product.ProductSearchRequest;
import com.NamVu.dto.request.product.ProductUpdateRequest;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.product.ProductResponse;
import com.NamVu.entity.Product;
import com.NamVu.entity.ProductImage;
import com.NamVu.exception.AppException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.ProductRepository;
import com.NamVu.service.ProductService;
import com.NamVu.specifications.ProductSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductServiceImpl implements ProductService {
    ProductRepository productRepository;
    ProductConverter productConverter;

    @Override
    public PageResponse<ProductResponse> search(ProductSearchRequest request, Pageable pageable) {
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
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(products.getTotalElements())
                .data(products.stream().map(productConverter::toResponse).toList())
                .build();
    }

    @Override
    public ProductResponse getByCode(String code) {
        return productConverter.toResponse(productRepository
                .findByCodeAndIsActive(code, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED)));
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_PRODUCT')")
    public ProductResponse create(ProductCreateRequest request) {
        if (productRepository.existsByCode(request.getCode()))
            throw new AppException(ErrorCode.PRODUCT_EXISTED);

        Product product = productConverter.toEntity(request);
        productRepository.save(product);

        return productConverter.toResponse(product);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_PRODUCT')")
    public ProductResponse update(String id, ProductUpdateRequest request) {
        Product existedProduct = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        Product updatedProduct = productConverter.toEntity(existedProduct, request);
        productRepository.save(updatedProduct);

        return productConverter.toResponse(updatedProduct);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_PRODUCT')")
    public void delete(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        product.setIsActive(StatusConstant.INACTIVE);
        productRepository.save(product);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_PRODUCT')")
    public void saveProductImages(String id, List<String> fileNames) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        List<ProductImage> productImages = fileNames.stream()
                .map(fileName -> new ProductImage(fileName, product))
                .toList();

        product.getImages().clear();
        product.getImages().addAll(productImages);
        productRepository.save(product);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_PRODUCT')")
    public void updateProductImages(String id, List<String> keepImages, List<String> newFileNames) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        // Xóa ảnh cũ nếu ko có trong keepImages
        if (CollectionUtils.isEmpty(keepImages)) {
            product.getImages().clear();
        } else {
            product.getImages().removeIf(image -> !keepImages.contains(image.getImagePath()));
        }

        // add ảnh mới
        List<ProductImage> newProductImages = newFileNames.stream()
                .map(fileName -> new ProductImage(fileName, product))
                .toList();

        product.getImages().addAll(newProductImages);
        productRepository.save(product);
    }
}
