package com.NamVu.repository;

import com.NamVu.entity.Supplier;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, String> {
    List<Supplier> findAllByIsActive(Byte isActive, Sort sort);

    List<Supplier> findAllByCategories_Code(String categoriesCode, Sort sort);

    Optional<Supplier> findByCode(String code);

    boolean existsByCode(String code);
}
