package com.javaweb.service;

import com.javaweb.dto.request.product.DiscountProductRequest;
import com.javaweb.entity.Discount;

import java.util.List;

public interface DiscountService {
    List<Discount> getAll();

    Discount create(Discount discount);

    Discount update(String id, Discount request);

    Discount addDiscountProducts(String id, DiscountProductRequest request);

    void delete(String id);
}
