package com.NamVu.repository;

import com.NamVu.entity.InventoryReceiptDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryReceiptDetailRepository extends JpaRepository<InventoryReceiptDetail, String> {
    Page<InventoryReceiptDetail> findByProductId(String productId, Pageable pageable);
}
