package com.NamVu.controller;

import com.NamVu.dto.request.supplier.SupplierCreateRequest;
import com.NamVu.dto.request.supplier.SupplierUpdateRequest;
import com.NamVu.dto.response.ApiResponse;
import com.NamVu.dto.response.supplier.SupplierResponse;
import com.NamVu.service.SupplierService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierController {
    SupplierService supplierService;

    @GetMapping
    public ApiResponse<List<SupplierResponse>> getAll() {
        return ApiResponse.<List<SupplierResponse>>builder()
                .result(supplierService.getAll())
                .build();
    }

    @PostMapping
    public ApiResponse<SupplierResponse> create(@RequestBody SupplierCreateRequest request) {
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.create(request))
                .build();
    }

    @PostMapping("/{code}")
    public ApiResponse<SupplierResponse> update(@PathVariable String code,
                                                @RequestBody SupplierUpdateRequest request) {
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.update(code, request))
                .build();
    }

    @DeleteMapping("/{code}")
    public ApiResponse<Void> delete(@PathVariable String code) {
        supplierService.delete(code);

        return ApiResponse.<Void>builder()
                .message("Delete successfully")
                .build();
    }
}
