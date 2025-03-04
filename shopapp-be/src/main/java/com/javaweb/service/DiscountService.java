package com.javaweb.service;

import com.javaweb.dto.request.product.DiscountProductRequest;
import com.javaweb.entity.Discount;

import java.util.List;

public interface DiscountService {
    List<Discount> getAll();

    Discount createOrUpdate(Discount discount);

    Discount addDiscountProducts(String id, DiscountProductRequest request);

    void delete(String id);
}
