package com.NamVu.service;

import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.inventoryReceipt.ReceiptDetailByProductResponse;
import org.springframework.data.domain.Pageable;

public interface InventoryReceiptDetailService {
    PageResponse<ReceiptDetailByProductResponse> getAllByProductId(String productId, Pageable pageable);
}
