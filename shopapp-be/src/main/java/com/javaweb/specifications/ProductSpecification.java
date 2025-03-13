package com.javaweb.specifications;

import com.javaweb.entity.Product;
import jakarta.persistence.criteria.Expression;
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

            // Sử dụng coalesce để lấy discountPrice nếu không null, nếu không thì lấy price
            Expression<Long> effectivePrice = criteriaBuilder.coalesce(
                    root.get("discountPrice"), root.get("price"));

            return criteriaBuilder.greaterThanOrEqualTo(effectivePrice, minPrice);
        };
    }

    public static Specification<Product> withMaxPrice(Long maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (maxPrice == null)
                return null;

            // Sử dụng coalesce để lấy discountPrice nếu không null, nếu không thì lấy price
            Expression<Long> effectivePrice = criteriaBuilder.coalesce(
                    root.get("discountPrice"), root.get("price"));

            return criteriaBuilder.lessThanOrEqualTo(effectivePrice, maxPrice);
        };
    }

    public static Specification<Product> withIsActive(byte isActive) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isActive"), isActive);
    }
}
