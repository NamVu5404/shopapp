package com.javaweb.repository;

import com.javaweb.entity.InventoryReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryReceiptRepository extends JpaRepository<InventoryReceipt, String> {
}
