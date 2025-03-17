package com.NamVu.service;

import com.NamVu.dto.response.inventoryReceipt.ReceiptDetailByProductResponse;
import com.NamVu.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface InventoryReceiptDetailService {
    PageResponse<ReceiptDetailByProductResponse> getAllByProductId(String productId, Pageable pageable);
}
