package com.javaweb.controller;

import com.javaweb.dto.request.inventoryReceipt.InventoryReceiptRequest;
import com.javaweb.dto.request.inventoryReceipt.InventoryStatusRequest;
import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.inventoryReceipt.InventoryReceiptResponse;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.service.InventoryReceiptService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inventory-receipts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Validated
public class InventoryReceiptController {
    InventoryReceiptService inventoryReceiptService;

    @GetMapping
    public ApiResponse<PageResponse<InventoryReceiptResponse>> getAll(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<InventoryReceiptResponse>>builder()
                .result(inventoryReceiptService.getAll(page, size))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<InventoryReceiptResponse> getById(@PathVariable String id) {
        return ApiResponse.<InventoryReceiptResponse>builder()
                .result(inventoryReceiptService.getById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<InventoryReceiptResponse> create(@RequestBody @Valid InventoryReceiptRequest request) {
        return ApiResponse.<InventoryReceiptResponse>builder()
                .result(inventoryReceiptService.create(request))
                .build();
    }

    @PostMapping("/{id}")
    public ApiResponse<InventoryReceiptResponse> update(@PathVariable String id,
                                                        @RequestBody @Valid InventoryReceiptRequest request) {
        return ApiResponse.<InventoryReceiptResponse>builder()
                .result(inventoryReceiptService.update(id, request))
                .build();
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<InventoryReceiptResponse> updateStatus(@PathVariable String id,
                                                              @RequestBody InventoryStatusRequest request) {
        return ApiResponse.<InventoryReceiptResponse>builder()
                .result(inventoryReceiptService.updateStatus(id, request))
                .build();
    }
}
