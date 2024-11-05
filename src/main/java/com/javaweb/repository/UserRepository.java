package com.javaweb.repository;

import com.javaweb.entity.User;
import com.javaweb.repository.custom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, UserRepositoryCustom {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);
}
