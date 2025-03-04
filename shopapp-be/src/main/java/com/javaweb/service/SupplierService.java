package com.javaweb.service;

import com.javaweb.entity.Supplier;

import java.util.List;

public interface SupplierService {
    List<Supplier> getAll();

    Supplier create(Supplier request);

    Supplier update(String code, Supplier request);

    void delete(String id);
}
