package com.javaweb.service.impl;

import com.javaweb.constant.StatusConstant;
import com.javaweb.entity.Supplier;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.SupplierRepository;
import com.javaweb.service.SupplierService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierServiceImpl implements SupplierService {
    SupplierRepository supplierRepository;

    @Override
    public List<Supplier> getAll() {
        return supplierRepository.findAllByIsActive(StatusConstant.ACTIVE);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CREATE_CATEGORY_SUPPLIER')")
    public Supplier create(Supplier request) {
        if (supplierRepository.existsByCode(request.getCode()))
            throw new CustomException(ErrorCode.SUPPLIER_EXISTS);

        return supplierRepository.save(request);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('UPDATE_CATEGORY_SUPPLIER')")
    public Supplier update(String code, Supplier request) {
        Supplier supplier = supplierRepository.findByCode(code)
                .orElseThrow(() -> new CustomException(ErrorCode.SUPPLIER_NOT_EXISTS));

        supplier.setName(request.getName());

        return supplierRepository.save(supplier);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('DELETE_CATEGORY_SUPPLIER')")
    public void delete(String id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.SUPPLIER_NOT_EXISTS));

        supplier.setIsActive(StatusConstant.INACTIVE);
        supplierRepository.save(supplier);
    }
}
