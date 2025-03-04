package com.javaweb.controller;

import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.inventoryReceipt.ReceiptDetailByProductResponse;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.service.InventoryReceiptDetailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/inventory-receipt-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryReceiptDetailController {
    InventoryReceiptDetailService inventoryReceiptDetailService;

    @GetMapping
    public ApiResponse<PageResponse<ReceiptDetailByProductResponse>> getAllByProductId(
            @RequestParam String productId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        return ApiResponse.<PageResponse<ReceiptDetailByProductResponse>>builder()
                .result(inventoryReceiptDetailService.getAllByProductId(productId, page, size))
                .build();
    }
}
