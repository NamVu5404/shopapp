package com.NamVu.controller;

import com.NamVu.dto.request.product.ProductCreateRequest;
import com.NamVu.dto.request.product.ProductSearchRequest;
import com.NamVu.dto.request.product.ProductUpdateRequest;
import com.NamVu.dto.response.ApiResponse;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.product.ProductResponse;
import com.NamVu.service.FileService;
import com.NamVu.service.ProductImportService;
import com.NamVu.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductController {
    ProductService productService;
    ProductImportService productImportService;
    FileService fileService;

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

    @PutMapping("/{id}")
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

    @PostMapping("/{id}/images")
    public ApiResponse<Void> uploadProductImages(@PathVariable String id,
                                                 @RequestParam("files") MultipartFile[] files) {
        try {
            List<String> fileNames = fileService.uploadFiles(files);
            productService.saveProductImages(id, fileNames);

            return ApiResponse.<Void>builder().build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .message(e.getMessage())
                    .build();
        }
    }

    @PutMapping("/{id}/images")
    public ApiResponse<Void> updateProductImages(@PathVariable String id,
                                                 @RequestParam(required = false) List<String> keepImages,
                                                 @RequestParam(required = false) MultipartFile[] newImages) {
        try {
            List<String> fileNames = fileService.uploadFiles(newImages);
            productService.updateProductImages(id, keepImages, fileNames);

            return ApiResponse.<Void>builder().build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .message(e.getMessage())
                    .build();
        }
    }

    @PostMapping("/import-excel")
    public ApiResponse<Void> importProducts(@RequestParam MultipartFile file) {
        productImportService.importFromExcel(file);
        return ApiResponse.<Void>builder().build();
    }
}
