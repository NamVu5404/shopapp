package com.javaweb.service;

import com.javaweb.dto.response.inventoryReceipt.ReceiptDetailByProductResponse;
import com.javaweb.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface InventoryReceiptDetailService {
    PageResponse<ReceiptDetailByProductResponse> getAllByProductId(String productId, Pageable pageable);
}
