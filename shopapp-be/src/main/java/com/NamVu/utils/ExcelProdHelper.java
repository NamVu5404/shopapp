package com.NamVu.utils;

import com.NamVu.dto.request.product.ProductCreateRequest;
import com.NamVu.exception.AppException;
import com.NamVu.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class ExcelProdHelper {
    private static final String SHEET_NAME = "products";

    public List<ProductCreateRequest> parseExcel(MultipartFile file) {
        List<ProductCreateRequest> products = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheet(SHEET_NAME);
            if (sheet == null) {
                throw new AppException(ErrorCode.INVALID_FILE_FORMAT);
            }

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Bỏ qua header

                ProductCreateRequest request = parseRow(row);
                if (request != null) {
                    products.add(request);
                }
            }
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_READ_ERROR);
        }

        return products;
    }

    private ProductCreateRequest parseRow(Row row) {
        try {
            return ProductCreateRequest.builder()
                    .categoryCode(getStringCellValue(row, 0))
                    .supplierCode(getStringCellValue(row, 1))
                    .code(getStringCellValue(row, 2))
                    .name(getStringCellValue(row, 3))
                    .description(getStringCellValue(row, 4))
                    .price((long) getNumericCellValue(row, 5))
                    .build();
        } catch (Exception e) {
            log.warn("Bỏ qua dòng {} do lỗi: {}", row.getRowNum(), e.getMessage());
            return null;
        }
    }

    private String getStringCellValue(Row row, int index) {
        Cell cell = row.getCell(index, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        return (cell == null) ? null : cell.getStringCellValue().trim();
    }

    private double getNumericCellValue(Row row, int index) {
        Cell cell = row.getCell(index, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        return (cell == null) ? 0 : cell.getNumericCellValue();
    }
}
