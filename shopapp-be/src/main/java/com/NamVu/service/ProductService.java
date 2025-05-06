package com.NamVu.service;

import com.NamVu.dto.request.product.ProductCreateRequest;
import com.NamVu.dto.request.product.ProductSearchRequest;
import com.NamVu.dto.request.product.ProductUpdateRequest;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.product.ProductResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    PageResponse<ProductResponse> search(ProductSearchRequest request, Pageable pageable);

    ProductResponse getByCode(String code);

    ProductResponse create(ProductCreateRequest request);

    ProductResponse update(String id, ProductUpdateRequest request);

    void delete(List<String> ids);

    void saveProductImages(String id, List<String> fileNames);

    void updateProductImages(String id, List<String> keepImages, List<String> newFileNames);
}
