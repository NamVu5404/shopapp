package com.javaweb.repository.custom;

import com.javaweb.dto.request.user.UserSearchRequest;
import com.javaweb.entity.User;

import java.util.List;

public interface UserRepositoryCustom {
    List<User> findAll(UserSearchRequest userSearchRequest);
}
