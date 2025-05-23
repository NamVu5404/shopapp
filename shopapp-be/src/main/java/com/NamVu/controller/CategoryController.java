package com.NamVu.controller;

import com.NamVu.dto.request.category.CategoryCreateRequest;
import com.NamVu.dto.request.category.CategoryUpdateRequest;
import com.NamVu.dto.response.ApiResponse;
import com.NamVu.dto.response.category.CategoryResponse;
import com.NamVu.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAll() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAll())
                .build();
    }

    @PostMapping
    public ApiResponse<CategoryResponse> create(@RequestBody @Valid CategoryCreateRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.create(request))
                .build();
    }

    @PutMapping("/{code}")
    public ApiResponse<CategoryResponse> update(@PathVariable String code,
                                                @RequestBody @Valid CategoryUpdateRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.update(code, request))
                .build();
    }

    @DeleteMapping("/{code}")
    public ApiResponse<Void> delete(@PathVariable String code) {
        categoryService.delete(code);

        return ApiResponse.<Void>builder()
                .message("Delete successfully")
                .build();
    }
}
