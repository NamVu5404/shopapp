package com.javaweb.controller;

import com.javaweb.dto.response.ApiResponse;
import com.javaweb.entity.Supplier;
import com.javaweb.service.SupplierService;
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
    public ApiResponse<List<Supplier>> getAll() {
        return ApiResponse.<List<Supplier>>builder()
                .result(supplierService.getAll())
                .build();
    }

    @PostMapping
    public ApiResponse<Supplier> create(@RequestBody Supplier supplier) {
        return ApiResponse.<Supplier>builder()
                .result(supplierService.create(supplier))
                .build();
    }

    @PostMapping("/{code}")
    public ApiResponse<Supplier> update(@PathVariable String code, @RequestBody Supplier supplier) {
        return ApiResponse.<Supplier>builder()
                .result(supplierService.update(code, supplier))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        supplierService.delete(id);

        return ApiResponse.<Void>builder()
                .message("Delete successfully")
                .build();
    }
}
