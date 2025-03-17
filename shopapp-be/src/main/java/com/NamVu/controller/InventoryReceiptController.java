package com.NamVu.controller;

import com.NamVu.dto.request.inventoryReceipt.InventoryReceiptRequest;
import com.NamVu.dto.request.inventoryReceipt.InventorySearchRequest;
import com.NamVu.dto.request.inventoryReceipt.InventoryStatusRequest;
import com.NamVu.dto.response.ApiResponse;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.inventoryReceipt.InventoryReceiptResponse;
import com.NamVu.enums.InventoryStatus;
import com.NamVu.service.InventoryReceiptService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public ApiResponse<PageResponse<InventoryReceiptResponse>> search(
            InventorySearchRequest request,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<InventoryReceiptResponse>>builder()
                .result(inventoryReceiptService.search(request, pageable))
                .build();
    }

    @GetMapping("/status/{status}")
    public ApiResponse<PageResponse<InventoryReceiptResponse>> getAllByStatus(
            @PathVariable InventoryStatus status,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<InventoryReceiptResponse>>builder()
                .result(inventoryReceiptService.getAllByStatus(status, pageable))
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

    @GetMapping("/status/PENDING/count")
    public ApiResponse<Integer> countTotalPendingReceipts() {
        return ApiResponse.<Integer>builder()
                .result(inventoryReceiptService.countTotalPendingReceipts())
                .build();
    }
}
