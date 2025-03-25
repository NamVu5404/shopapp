package com.NamVu.service;

import com.NamVu.dto.request.inventoryReceipt.InventoryReceiptRequest;
import com.NamVu.dto.request.inventoryReceipt.InventorySearchRequest;
import com.NamVu.dto.request.inventoryReceipt.InventoryStatusRequest;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.inventoryReceipt.InventoryReceiptResponse;
import com.NamVu.enums.InventoryStatus;
import org.springframework.data.domain.Pageable;

public interface InventoryReceiptService {
    PageResponse<InventoryReceiptResponse> search(InventorySearchRequest request, Pageable pageable);

    PageResponse<InventoryReceiptResponse> getAllByStatus(InventoryStatus status, Pageable pageable);

    InventoryReceiptResponse getById(String id);

    InventoryReceiptResponse create(InventoryReceiptRequest request);

    InventoryReceiptResponse update(String id, InventoryReceiptRequest request);

    InventoryReceiptResponse updateStatus(String id, InventoryStatusRequest request);

    int countTotalPendingReceipts();
}
