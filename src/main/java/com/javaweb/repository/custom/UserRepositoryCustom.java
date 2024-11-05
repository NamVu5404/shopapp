package com.javaweb.repository.custom;

import com.javaweb.entity.User;
import com.javaweb.dto.request.UserSearchRequest;

import java.util.List;

public interface UserRepositoryCustom {
    List<User> findAll(UserSearchRequest userSearchRequest);
}
