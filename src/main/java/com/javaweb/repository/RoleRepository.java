package com.javaweb.repository;

import com.javaweb.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    List<Role> findByUsers_Id(String id);

    Role findByCode(String code);

    boolean existsByCode(String code);

    void deleteByCodeIn(List<String> codes);

    boolean existsByCodeInAndUsersIsNotEmpty(List<String> codes);
}
