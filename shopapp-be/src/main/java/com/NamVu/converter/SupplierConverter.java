package com.NamVu.converter;

import com.NamVu.dto.request.supplier.SupplierCreateRequest;
import com.NamVu.dto.response.supplier.SupplierResponse;
import com.NamVu.entity.Supplier;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SupplierConverter {

    @Autowired
    private ModelMapper modelMapper;

    public SupplierResponse toResponse(Supplier supplier) {
        return modelMapper.map(supplier, SupplierResponse.class);
    }

    public Supplier toEntity(SupplierCreateRequest request) {
        return modelMapper.map(request, Supplier.class);
    }
}
