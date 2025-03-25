package com.NamVu.controller;

import com.NamVu.dto.request.product.DiscountProductRequest;
import com.NamVu.dto.response.ApiResponse;
import com.NamVu.entity.Discount;
import com.NamVu.service.DiscountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/discounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DiscountController {
    DiscountService discountService;

    @GetMapping
    public ApiResponse<List<Discount>> getAll() {
        return ApiResponse.<List<Discount>>builder()
                .result(discountService.getAll())
                .build();
    }

    @PostMapping
    public ApiResponse<Discount> create(@RequestBody Discount request) {
        return ApiResponse.<Discount>builder()
                .result(discountService.create(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<Discount> update(@PathVariable String id, @RequestBody Discount request) {
        return ApiResponse.<Discount>builder()
                .result(discountService.update(id, request))
                .build();
    }

    @PostMapping("/{id}/products")
    public ApiResponse<Discount> addDiscountProducts(@PathVariable String id,
                                                     @RequestBody DiscountProductRequest request) {
        return ApiResponse.<Discount>builder()
                .result(discountService.addDiscountProducts(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        discountService.delete(id);

        return ApiResponse.<Void>builder()
                .message("Delete successfully")
                .build();
    }
}
