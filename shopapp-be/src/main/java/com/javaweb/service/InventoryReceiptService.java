package com.javaweb.service;

import com.javaweb.dto.request.inventoryReceipt.InventoryReceiptRequest;
import com.javaweb.dto.request.inventoryReceipt.InventoryStatusRequest;
import com.javaweb.dto.response.inventoryReceipt.InventoryReceiptResponse;
import com.javaweb.dto.response.PageResponse;

public interface InventoryReceiptService {
    PageResponse<InventoryReceiptResponse> getAll(int page, int size);

    InventoryReceiptResponse getById(String id);

    InventoryReceiptResponse create(InventoryReceiptRequest request);

    InventoryReceiptResponse update(String id, InventoryReceiptRequest request);

    InventoryReceiptResponse updateStatus(String id, InventoryStatusRequest request);
}
