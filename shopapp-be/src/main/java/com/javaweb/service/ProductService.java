package com.javaweb.service;

import com.javaweb.dto.request.product.ProductCreateRequest;
import com.javaweb.dto.request.product.ProductSearchRequest;
import com.javaweb.dto.request.product.ProductUpdateRequest;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.product.ProductResponse;

public interface ProductService {
    PageResponse<ProductResponse> search(ProductSearchRequest request, int page, int size);

    ProductResponse getByCode(String code);

    ProductResponse create(ProductCreateRequest request);

    ProductResponse update(String id, ProductUpdateRequest request);

    void delete(String id);
}
