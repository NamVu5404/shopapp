package com.NamVu.repository;

import com.NamVu.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String>, JpaSpecificationExecutor<Product> {
    Optional<Product> findByCodeAndIsActive(String code, byte isActive);

    boolean existsByCode(String code);
}
