package com.javaweb.converter;

import com.javaweb.dto.request.category.CategoryCreateRequest;
import com.javaweb.dto.request.category.CategoryUpdateRequest;
import com.javaweb.entity.Category;
import com.javaweb.entity.Supplier;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.SupplierRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryConverter {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private SupplierRepository supplierRepository;

    public Category toEntity(CategoryCreateRequest request) {
        Category category = modelMapper.map(request, Category.class);

        List<Supplier> suppliers = getSuppliers(request.getSupplierIds());
        category.setSuppliers(suppliers);

        return category;
    }

    public Category toEntity(Category existedCategory, CategoryUpdateRequest request) {
        modelMapper.map(request, existedCategory);

        List<Supplier> suppliers = getSuppliers(request.getSupplierIds());
        existedCategory.setSuppliers(suppliers);

        return existedCategory;
    }

    private List<Supplier> getSuppliers(List<String> supplierIds) {
        return supplierIds
                .stream()
                .map(id -> supplierRepository.findById(id)
                        .orElseThrow(() -> new CustomException(ErrorCode.SUPPLIER_NOT_EXISTS)))
                .collect(Collectors.toList());
    }
}
