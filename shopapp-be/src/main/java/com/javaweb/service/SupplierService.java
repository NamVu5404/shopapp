package com.javaweb.service;

import com.javaweb.dto.request.supplier.SupplierCreateRequest;
import com.javaweb.dto.request.supplier.SupplierUpdateRequest;
import com.javaweb.dto.response.supplier.SupplierResponse;

import java.util.List;

public interface SupplierService {
    List<SupplierResponse> getAll();

    SupplierResponse create(SupplierCreateRequest request);

    SupplierResponse update(String code, SupplierUpdateRequest request);

    void delete(String code);
}
