package com.NamVu.converter;

import com.NamVu.dto.request.product.ProductCreateRequest;
import com.NamVu.dto.request.product.ProductUpdateRequest;
import com.NamVu.dto.response.product.ProductResponse;
import com.NamVu.entity.*;
import com.NamVu.exception.AppException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.CategoryRepository;
import com.NamVu.repository.DiscountRepository;
import com.NamVu.repository.SupplierRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductConverter {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private DiscountRepository discountRepository;

    public ProductResponse toResponse(Product product) {
        ProductResponse response = modelMapper.map(product, ProductResponse.class);

        response.setCategoryCode(product.getCategory().getCode());
        response.setSupplierCode(product.getSupplier().getCode());
        if (product.getDiscount() != null)
            response.setDiscountName(product.getDiscount().getName());

        if (product.getImages() != null) {
            response.setImages(
                    product.getImages().stream()
                            .map(ProductImage::getImagePath)
                            .toList()
            );
        }

        return response;
    }

    // create
    public Product toEntity(ProductCreateRequest request) {
        Product product = modelMapper.map(request, Product.class);
        return getProduct(product, request.getCategoryCode(), request.getSupplierCode());
    }

    // update
    public Product toEntity(Product existedProduct, ProductUpdateRequest request) {
        modelMapper.map(request, existedProduct);

        if (request.getDiscountId() != null) {
            Discount discount = discountRepository.findById(request.getDiscountId())
                    .orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_EXISTED));

            existedProduct.setDiscount(discount);

            existedProduct.setDiscountPrice(Math.round(existedProduct.getPrice()
                    * (100 - existedProduct.getDiscount().getPercent()) / 100.0));
        } else {
            existedProduct.setDiscount(null);
            existedProduct.setDiscountPrice(null);
        }

        return getProduct(existedProduct, request.getCategoryCode(), request.getSupplierCode());
    }

    private Product getProduct(Product product, String categoryCode, String supplierCode) {
        Category category = categoryRepository.findByCode(categoryCode)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        product.setCategory(category);

        Supplier supplier = supplierRepository.findByCode(supplierCode)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_EXISTED));
        product.setSupplier(supplier);

        return product;
    }
}
