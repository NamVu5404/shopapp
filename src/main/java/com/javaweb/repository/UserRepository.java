package com.javaweb.repository;

import com.javaweb.entity.User;
import com.javaweb.repository.custom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, UserRepositoryCustom {
    boolean existsByUsername(String username);

    boolean existsByIdAndStatus(String id, byte status);

    Optional<User> findByUsernameAndStatus(String username, byte status);

    Optional<User> findByIdAndStatus(String id, byte status);
}
