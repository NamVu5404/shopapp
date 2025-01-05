package com.javaweb.repository;

import com.javaweb.entity.User;
import com.javaweb.repository.custom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String>, UserRepositoryCustom {
    boolean existsByUsername(String username);

    boolean existsByIdAndIsActive(String id, byte status);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndIsActive(String username, byte status);

    Optional<User> findByIdAndIsActive(String id, byte status);
}
