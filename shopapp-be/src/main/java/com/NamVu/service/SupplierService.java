package com.NamVu.service;

import com.NamVu.dto.request.supplier.SupplierCreateRequest;
import com.NamVu.dto.request.supplier.SupplierUpdateRequest;
import com.NamVu.dto.response.supplier.SupplierResponse;

import java.util.List;

public interface SupplierService {
    List<SupplierResponse> getAll();

    SupplierResponse create(SupplierCreateRequest request);

    SupplierResponse update(String code, SupplierUpdateRequest request);

    void delete(String code);
}
