package com.javaweb.service;

import com.javaweb.dto.request.category.CategoryCreateRequest;
import com.javaweb.dto.request.category.CategoryUpdateRequest;
import com.javaweb.dto.response.category.CategoryResponse;
import com.javaweb.entity.Category;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAll();

    CategoryResponse create(CategoryCreateRequest request);

    CategoryResponse update(String code, CategoryUpdateRequest request);

    void delete(String code);
}
