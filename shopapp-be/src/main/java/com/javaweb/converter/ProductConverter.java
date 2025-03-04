package com.javaweb.converter;

import com.javaweb.dto.request.product.ProductCreateRequest;
import com.javaweb.dto.request.product.ProductUpdateRequest;
import com.javaweb.dto.response.product.ProductResponse;
import com.javaweb.entity.Category;
import com.javaweb.entity.Discount;
import com.javaweb.entity.Product;
import com.javaweb.entity.Supplier;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.CategoryRepository;
import com.javaweb.repository.DiscountRepository;
import com.javaweb.repository.SupplierRepository;
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

        return response;
    }

    // create
    public Product toEntity(ProductCreateRequest request) {
        Product product = modelMapper.map(request, Product.class);
        return getProduct(product, request.getCategoryId(), request.getSupplierId());
    }

    // update
    public Product toEntity(Product existedProduct, ProductUpdateRequest request) {
        modelMapper.map(request, existedProduct);

        if (request.getDiscountId() != null) {
            Discount discount = discountRepository.findById(request.getDiscountId())
                    .orElseThrow(() -> new CustomException(ErrorCode.DISCOUNT_NOT_EXISTS));

            existedProduct.setDiscount(discount);

            existedProduct.setDiscountPrice(Math.round(existedProduct.getPrice()
                    * (100 - existedProduct.getDiscount().getPercent()) / 100.0));
        } else {
            existedProduct.setDiscount(null);
            existedProduct.setDiscountPrice(null);
        }

        return getProduct(existedProduct, request.getCategoryId(), request.getSupplierId());
    }

    private Product getProduct(Product product, String categoryId, String supplierId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_EXISTS));
        product.setCategory(category);

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new CustomException(ErrorCode.SUPPLIER_NOT_EXISTS));
        product.setSupplier(supplier);

        return product;
    }
}
