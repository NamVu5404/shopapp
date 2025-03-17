package com.NamVu.service.impl;

import com.NamVu.constant.StatusConstant;
import com.NamVu.converter.SupplierConverter;
import com.NamVu.dto.request.supplier.SupplierCreateRequest;
import com.NamVu.dto.request.supplier.SupplierUpdateRequest;
import com.NamVu.dto.response.supplier.SupplierResponse;
import com.NamVu.entity.Supplier;
import com.NamVu.exception.CustomException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.SupplierRepository;
import com.NamVu.service.SupplierService;
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
public class SupplierServiceImpl implements SupplierService {
    SupplierRepository supplierRepository;
    SupplierConverter supplierConverter;

    @Override
    public List<SupplierResponse> getAll() {
        Sort sort = Sort.by(Sort.Direction.ASC, "code");

        return supplierRepository.findAllByIsActive(StatusConstant.ACTIVE, sort)
                .stream().map(supplierConverter::toResponse)
                .toList();
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_CATEGORY_SUPPLIER')")
    public SupplierResponse create(SupplierCreateRequest request) {
        if (supplierRepository.existsByCode(request.getCode()))
            throw new CustomException(ErrorCode.SUPPLIER_EXISTS);

        Supplier supplier = supplierConverter.toEntity(request);
        supplierRepository.save(supplier);

        return supplierConverter.toResponse(supplier);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_CATEGORY_SUPPLIER')")
    public SupplierResponse update(String code, SupplierUpdateRequest request) {
        Supplier supplier = supplierRepository.findByCode(code)
                .orElseThrow(() -> new CustomException(ErrorCode.SUPPLIER_NOT_EXISTS));

        supplier.setName(request.getName());
        supplierRepository.save(supplier);

        return supplierConverter.toResponse(supplier);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CUD_CATEGORY_SUPPLIER')")
    public void delete(String code) {
        Supplier supplier = supplierRepository.findByCode(code)
                .orElseThrow(() -> new CustomException(ErrorCode.SUPPLIER_NOT_EXISTS));

        supplier.setIsActive(StatusConstant.INACTIVE);
        supplierRepository.save(supplier);
    }
}
