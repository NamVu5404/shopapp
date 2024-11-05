package com.javaweb.repository;

import com.javaweb.entity.Permission;
import com.javaweb.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {
    boolean existsByCode(String code);
    Permission findByCode(String code);
    void deleteByCodeIn(List<String> code);
    boolean existsByCodeInAndRolesIsNotEmpty(List<String> codes);
}
