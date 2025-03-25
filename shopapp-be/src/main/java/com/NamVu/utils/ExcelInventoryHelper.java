package com.NamVu.utils;

import com.NamVu.dto.request.inventoryReceipt.InventoryReceiptDetailRequest;
import com.NamVu.dto.request.inventoryReceipt.InventoryReceiptRequest;
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
public class ExcelInventoryHelper {
    private static final String SHEET_NAME = "inventory_receipt";

    public InventoryReceiptRequest parseExcel(MultipartFile file) {
        InventoryReceiptRequest request = new InventoryReceiptRequest();
        List<InventoryReceiptDetailRequest> detailRequests = new ArrayList<>();
        long totalAmount = 0L;

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheet(SHEET_NAME);
            if (sheet == null) {
                throw new AppException(ErrorCode.INVALID_FILE_FORMAT);
            }

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Bỏ qua header

                if (request.getNote() == null) {
                    request.setNote(getStringCellValue(row, 3));
                }

                InventoryReceiptDetailRequest detailRequest = parseRow(row);
                if (detailRequest != null) {
                    detailRequests.add(detailRequest);
                    totalAmount += detailRequest.getQuantity() * detailRequest.getPrice();
                }
            }

            request.setDetails(detailRequests);
            request.setTotalAmount(totalAmount);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_READ_ERROR);
        }

        return request;
    }

    private InventoryReceiptDetailRequest parseRow(Row row) {
        try {
            return InventoryReceiptDetailRequest.builder()
                    .productCode(getStringCellValue(row, 0))
                    .quantity((int) getNumericCellValue(row, 1))
                    .price((long) getNumericCellValue(row, 2))
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
