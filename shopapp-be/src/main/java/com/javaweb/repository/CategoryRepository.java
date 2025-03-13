package com.javaweb.repository;

import com.javaweb.entity.Category;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {
    List<Category> findAllByIsActive(Byte isActive, Sort sort);

    Optional<Category> findByCode(String code);

    boolean existsByCode(String code);
}
