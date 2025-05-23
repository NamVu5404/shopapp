package com.NamVu.repository;

import com.NamVu.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, String> {
    List<Role> findByUsers_Id(String id);

    Role findByCode(String code);

    boolean existsByCode(String code);

    void deleteByCodeIn(List<String> codes);

    boolean existsByCodeInAndUsersIsNotEmpty(List<String> codes);
}
