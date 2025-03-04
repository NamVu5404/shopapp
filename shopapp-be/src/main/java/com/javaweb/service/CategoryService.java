package com.javaweb.service;

import com.javaweb.dto.request.category.CategoryCreateRequest;
import com.javaweb.dto.request.category.CategoryUpdateRequest;
import com.javaweb.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAll();

    Category create(CategoryCreateRequest request);

    Category update(String code, CategoryUpdateRequest request);

    void delete(String id);
}
