package com.javaweb.controller;

import com.javaweb.dto.request.category.CategoryCreateRequest;
import com.javaweb.dto.request.category.CategoryUpdateRequest;
import com.javaweb.dto.response.ApiResponse;
import com.javaweb.entity.Category;
import com.javaweb.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<Category>> getAll() {
        return ApiResponse.<List<Category>>builder()
                .result(categoryService.getAll())
                .build();
    }

    @PostMapping
    public ApiResponse<Category> create(@RequestBody @Valid CategoryCreateRequest request) {
        return ApiResponse.<Category>builder()
                .result(categoryService.create(request))
                .build();
    }

    @PostMapping("/{code}")
    public ApiResponse<Category> update(@PathVariable String code, @RequestBody @Valid CategoryUpdateRequest request) {
        return ApiResponse.<Category>builder()
                .result(categoryService.update(code, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        categoryService.delete(id);

        return ApiResponse.<Void>builder()
                .message("Delete successfully")
                .build();
    }
}
