package com.NamVu.service;

import org.springframework.web.multipart.MultipartFile;

public interface ProductImportService {
    void importFromExcel(MultipartFile file);
}
