package com.javaweb.service;

import com.javaweb.dto.request.user.ChangePasswordRequest;
import com.javaweb.dto.request.user.UserCreateRequest;
import com.javaweb.dto.request.user.UserSearchRequest;
import com.javaweb.dto.request.user.UserUpdateRequest;
import com.javaweb.dto.response.user.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> search(UserSearchRequest request);

    UserResponse create(UserCreateRequest request);

    UserResponse update(String id, UserUpdateRequest request);

    void delete(List<String> ids);

    UserResponse getMyInfo();

    void changePassword(ChangePasswordRequest request);

    UserResponse getById(String id);

    void setPassword(String password);
}
