package com.NamVu.service;

import com.NamVu.dto.request.category.CategoryCreateRequest;
import com.NamVu.dto.request.category.CategoryUpdateRequest;
import com.NamVu.dto.response.category.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAll();

    CategoryResponse create(CategoryCreateRequest request);

    CategoryResponse update(String code, CategoryUpdateRequest request);

    void delete(String code);
}
