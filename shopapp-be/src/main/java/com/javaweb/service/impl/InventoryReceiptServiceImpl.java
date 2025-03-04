package com.javaweb.service.impl;

import com.javaweb.converter.InventoryReceiptConverter;
import com.javaweb.dto.request.inventoryReceipt.InventoryReceiptRequest;
import com.javaweb.dto.request.inventoryReceipt.InventoryStatusRequest;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.inventoryReceipt.InventoryReceiptResponse;
import com.javaweb.entity.InventoryReceipt;
import com.javaweb.entity.InventoryReceiptDetail;
import com.javaweb.entity.Product;
import com.javaweb.enums.ReceiptStatus;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.InventoryReceiptDetailRepository;
import com.javaweb.repository.InventoryReceiptRepository;
import com.javaweb.repository.ProductRepository;
import com.javaweb.service.InventoryReceiptService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryReceiptServiceImpl implements InventoryReceiptService {
    InventoryReceiptRepository receiptRepository;
    InventoryReceiptDetailRepository receiptDetailRepository;
    ProductRepository productRepository;
    ModelMapper modelMapper;
    InventoryReceiptConverter converter;

    @Override
    @PreAuthorize("hasAuthority('CRU_RECEIPT')")
    public PageResponse<InventoryReceiptResponse> getAll(int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<InventoryReceipt> receipts = receiptRepository.findAll(pageable);

        List<InventoryReceiptResponse> receiptResponses = receipts.stream()
                .map((receipt) -> modelMapper.map(receipt, InventoryReceiptResponse.class))
                .toList();

        return PageResponse.<InventoryReceiptResponse>builder()
                .totalPage(receipts.getTotalPages())
                .pageSize(size)
                .currentPage(page)
                .totalElements(receipts.getTotalElements())
                .data(receiptResponses)
                .build();
    }

    @Override
    @PreAuthorize("hasAuthority('CRU_RECEIPT')")
    public InventoryReceiptResponse getById(String id) {
        InventoryReceipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.INVENTORY_RECEIPT_NOT_EXISTS));

        return converter.toResponse(receipt, receipt.getDetails());
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CRU_RECEIPT')")
    public InventoryReceiptResponse create(InventoryReceiptRequest request) {
        // save receipt
        InventoryReceipt receipt = InventoryReceipt.builder()
                .totalAmount(request.getTotalAmount())
                .status(ReceiptStatus.PENDING)
                .note(request.getNote())
                .build();

        // receipt detail
        List<InventoryReceiptDetail> details = converter.toDetailEntity(receipt, request.getDetails());
        receipt.setDetails(details);

        receiptRepository.save(receipt);

        return converter.toResponse(receipt, details);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CRU_RECEIPT')")
    public InventoryReceiptResponse update(String id, InventoryReceiptRequest request) {
        InventoryReceipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.INVENTORY_RECEIPT_NOT_EXISTS));

        // Chỉ update khi ở trạng thái pending
        if (!ReceiptStatus.PENDING.equals(receipt.getStatus()))
            throw new CustomException(ErrorCode.CAN_NOT_EDITABLE);

        // save updated receipt
        receipt.setTotalAmount(request.getTotalAmount());
        receipt.setNote(request.getNote());

        // Xóa liên kết cũ
        receiptDetailRepository.deleteByReceiptId(id);

        // save receipt detail
        List<InventoryReceiptDetail> details = converter.toDetailEntity(receipt, request.getDetails());
        receipt.setDetails(details);

        receiptRepository.save(receipt);

        return converter.toResponse(receipt, details);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public InventoryReceiptResponse updateStatus(String id, InventoryStatusRequest request) {
        InventoryReceipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.INVENTORY_RECEIPT_NOT_EXISTS));

        // Chỉ update khi ở trạng thái pending
        if (!ReceiptStatus.PENDING.equals(receipt.getStatus()))
            throw new CustomException(ErrorCode.CAN_NOT_EDITABLE);

        // New status: COMPLETED, update số lượng sản phẩm
        if (ReceiptStatus.COMPLETED.equals(request.getStatus())) {
            updateProductInventory(receipt);
        }

        receipt.setStatus(request.getStatus());
        receiptRepository.save(receipt);

        return converter.toResponse(receipt, receipt.getDetails());
    }

    private void updateProductInventory(InventoryReceipt receipt) {
        List<Product> updatedProducts = receipt.getDetails().stream()
                .map(detail -> {
                    Product product = detail.getProduct();
                    // update inventory quantity
                    product.setInventoryQuantity(product.getInventoryQuantity() + detail.getQuantity());
                    return product;
                })
                .toList();

        productRepository.saveAll(updatedProducts);
    }
}
