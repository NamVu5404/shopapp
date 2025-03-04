package com.javaweb.service.impl;

import com.javaweb.converter.InventoryReceiptConverter;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.inventoryReceipt.ReceiptDetailByProductResponse;
import com.javaweb.entity.InventoryReceiptDetail;
import com.javaweb.repository.InventoryReceiptDetailRepository;
import com.javaweb.service.InventoryReceiptDetailService;
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

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryReceiptDetailServiceImpl implements InventoryReceiptDetailService {
    InventoryReceiptDetailRepository receiptDetailRepository;
    ModelMapper modelMapper;
    InventoryReceiptConverter converter;

    @Override
    @PreAuthorize("hasAuthority('CRU_RECEIPT')")
    public PageResponse<ReceiptDetailByProductResponse> getAllByProductId(String productId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<InventoryReceiptDetail> receiptDetails = receiptDetailRepository.findByProductId(productId, pageable);

        return PageResponse.<ReceiptDetailByProductResponse>builder()
                .totalPage(receiptDetails.getTotalPages())
                .currentPage(page)
                .pageSize(size)
                .totalElements(receiptDetails.getTotalElements())
                .data(converter.toDetailResponse(receiptDetails))
                .build();
    }
}
