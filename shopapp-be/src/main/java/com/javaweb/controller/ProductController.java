package com.javaweb.controller;

import com.javaweb.dto.request.product.ProductCreateRequest;
import com.javaweb.dto.request.product.ProductSearchRequest;
import com.javaweb.dto.request.product.ProductUpdateRequest;
import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.product.ProductResponse;
import com.javaweb.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;

    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> search(
            ProductSearchRequest request,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", defaultValue = "point") String sortBy,
            @RequestParam(value = "direction", defaultValue = "DESC") String direction
    ) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);

        Sort sort = Sort.by(sortDirection, sortBy)
                .and(Sort.by(Sort.Direction.DESC, "inventoryQuantity"))
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .result(productService.search(request, pageable))
                .build();
    }

    @GetMapping("/{code}")
    public ApiResponse<ProductResponse> getByCode(@PathVariable String code) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getByCode(code))
                .build();
    }

    @PostMapping
    public ApiResponse<ProductResponse> create(@RequestBody @Valid ProductCreateRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.create(request))
                .build();
    }

    @PostMapping("/{id}")
    public ApiResponse<ProductResponse> update(@PathVariable String id,
                                               @RequestBody @Valid ProductUpdateRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        productService.delete(id);

        return ApiResponse.<Void>builder()
                .message("Deleted successfully")
                .build();
    }
}
