package com.javaweb.specifications;

import com.javaweb.entity.Product;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class ProductSpecification {
    public static Specification<Product> withId(String id) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(id))
                return null;

            return criteriaBuilder.like(root.get("id"), "%" + id + "%");
        };
    }

    public static Specification<Product> withCategoryCode(String categoryCode) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(categoryCode))
                return null;

            return criteriaBuilder.equal(root.get("category").get("code"), categoryCode);
        };
    }

    public static Specification<Product> withSupplierCode(String supplierCode) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(supplierCode))
                return null;

            return criteriaBuilder.equal(root.get("supplier").get("code"), supplierCode);
        };
    }

    public static Specification<Product> withCode(String code) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(code))
                return null;

            return criteriaBuilder.like(root.get("code"), "%" + code + "%");
        };
    }

    public static Specification<Product> withName(String name) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(name))
                return null;

            return criteriaBuilder.like(root.get("name"), "%" + name + "%");
        };
    }

    public static Specification<Product> withMinPrice(Long minPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null)
                return null;

            return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
        };
    }

    public static Specification<Product> withMaxPrice(Long maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (maxPrice == null)
                return null;

            return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static Specification<Product> withIsActive(byte isActive) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isActive"), isActive);
    }
}
