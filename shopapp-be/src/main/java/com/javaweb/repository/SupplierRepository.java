package com.javaweb.repository;

import com.javaweb.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, String> {
    List<Supplier> findAllByIsActive(Byte isActive);

    Optional<Supplier> findByCode(String code);

    boolean existsByCode(String code);
}
