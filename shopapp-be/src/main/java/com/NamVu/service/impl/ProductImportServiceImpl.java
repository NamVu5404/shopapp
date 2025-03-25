package com.NamVu.service.impl;

import com.NamVu.dto.request.product.ProductCreateRequest;
import com.NamVu.exception.AppException;
import com.NamVu.service.ProductImportService;
import com.NamVu.service.ProductService;
import com.NamVu.utils.ExcelProdHelper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductImportServiceImpl implements ProductImportService {
    ProductService productService;
    ExcelProdHelper excelProdHelper;

    @Override
    public void importFromExcel(MultipartFile file) {
        List<ProductCreateRequest> requests = excelProdHelper.parseExcel(file);

        for (ProductCreateRequest request : requests) {
            try {
                productService.create(request);
                log.info("Thêm sản phẩm {} thành công!", request.getCode());
            } catch (AppException e) {
                log.error("Lỗi khi thêm sản phẩm {}: {}", request.getCode(), e.getErrorCode().getMessage());
            }
        }
    }
}   
