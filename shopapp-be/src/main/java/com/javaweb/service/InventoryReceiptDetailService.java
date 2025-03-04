package com.javaweb.service;

import com.javaweb.dto.response.inventoryReceipt.ReceiptDetailByProductResponse;
import com.javaweb.dto.response.PageResponse;

public interface InventoryReceiptDetailService {
    PageResponse<ReceiptDetailByProductResponse> getAllByProductId(String productId, int page, int size);
}
