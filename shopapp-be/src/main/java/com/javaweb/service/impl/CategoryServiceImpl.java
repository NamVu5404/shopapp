package com.javaweb.service.impl;

import com.javaweb.constant.StatusConstant;
import com.javaweb.converter.CategoryConverter;
import com.javaweb.dto.request.category.CategoryCreateRequest;
import com.javaweb.dto.request.category.CategoryUpdateRequest;
import com.javaweb.dto.response.category.CategoryResponse;
import com.javaweb.entity.Category;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.CategoryRepository;
import com.javaweb.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryServiceImpl implements CategoryService {
    CategoryRepository categoryRepository;
    CategoryConverter categoryConverter;

    @Override
    public List<CategoryResponse> getAll() {
        Sort sort = Sort.by(Sort.Direction.ASC, "code");

        return categoryRepository.findAllByIsActive(StatusConstant.ACTIVE, sort).stream()
                .map(categoryConverter::toResponse)
                .toList();
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_CATEGORY_SUPPLIER')")
    public CategoryResponse create(CategoryCreateRequest request) {
        if (categoryRepository.existsByCode(request.getCode()))
            throw new CustomException(ErrorCode.CATEGORY_EXISTS);

        Category category = categoryConverter.toEntity(request);
        categoryRepository.save(category);

        return categoryConverter.toResponse(category);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_CATEGORY_SUPPLIER')")
    public CategoryResponse update(String code, CategoryUpdateRequest request) {
        Category existedCategory = categoryRepository.findByCode(code)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_EXISTS));

        Category updatedCategory = categoryConverter.toEntity(existedCategory, request);
        categoryRepository.save(updatedCategory);

        return categoryConverter.toResponse(updatedCategory);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_CATEGORY_SUPPLIER')")
    public void delete(String code) {
        Category category = categoryRepository.findByCode(code)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_EXISTS));

        category.setIsActive(StatusConstant.INACTIVE);
        categoryRepository.save(category);
    }
}
