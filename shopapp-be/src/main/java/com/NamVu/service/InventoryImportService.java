package com.NamVu.service;

import org.springframework.web.multipart.MultipartFile;

public interface InventoryImportService {
    void importFromExcel(MultipartFile file);
}
