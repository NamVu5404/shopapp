package com.javaweb.service;

import com.javaweb.dto.request.inventoryReceipt.InventoryReceiptRequest;
import com.javaweb.dto.request.inventoryReceipt.InventorySearchRequest;
import com.javaweb.dto.request.inventoryReceipt.InventoryStatusRequest;
import com.javaweb.dto.response.inventoryReceipt.InventoryReceiptResponse;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.enums.InventoryStatus;
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
