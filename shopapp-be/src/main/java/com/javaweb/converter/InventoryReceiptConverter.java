package com.javaweb.converter;

import com.javaweb.dto.request.inventoryReceipt.InventoryReceiptDetailRequest;
import com.javaweb.dto.response.inventoryReceipt.InventoryReceiptDetailResponse;
import com.javaweb.dto.response.inventoryReceipt.InventoryReceiptResponse;
import com.javaweb.dto.response.inventoryReceipt.ReceiptDetailByProductResponse;
import com.javaweb.entity.InventoryReceipt;
import com.javaweb.entity.InventoryReceiptDetail;
import com.javaweb.entity.Product;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class InventoryReceiptConverter {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ProductRepository productRepository;

    public InventoryReceiptResponse toResponse(InventoryReceipt receipt,
                                               List<InventoryReceiptDetail> details) {
        List<InventoryReceiptDetailResponse> detailResponses = details.stream()
                .map(detail -> InventoryReceiptDetailResponse.builder()
                        .id(detail.getId())
                        .productId(detail.getProduct().getId())
                        .productCode(detail.getProduct().getCode())
                        .quantity(detail.getQuantity())
                        .price(detail.getPrice())
                        .build())
                .collect(Collectors.toList());

        InventoryReceiptResponse receiptResponse = modelMapper.map(receipt, InventoryReceiptResponse.class);
        receiptResponse.setDetailResponses(detailResponses);
        return receiptResponse;
    }

    public List<ReceiptDetailByProductResponse> toDetailResponse(Page<InventoryReceiptDetail> receiptDetails) {
        return receiptDetails.stream()
                .map(receiptDetail -> {
                    var detailResponse = modelMapper.map(receiptDetail, ReceiptDetailByProductResponse.class);

                    detailResponse.setReceiptId(receiptDetail.getReceipt().getId());
                    detailResponse.setProductId(receiptDetail.getProduct().getId());
                    detailResponse.setProductCode(receiptDetail.getProduct().getCode());
                    detailResponse.setStatus(receiptDetail.getReceipt().getStatus());

                    return detailResponse;
                })
                .toList();
    }

    public List<InventoryReceiptDetail> toDetailEntity(InventoryReceipt receipt,
                                                       List<InventoryReceiptDetailRequest> details) {
        return details.stream()
                .map(detailRequest -> {
                    Product product = productRepository.findById(detailRequest.getProductId())
                            .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_EXISTS));

                    return InventoryReceiptDetail.builder()
                            .receipt(receipt)
                            .product(product)
                            .quantity(detailRequest.getQuantity())
                            .price(detailRequest.getPrice())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
