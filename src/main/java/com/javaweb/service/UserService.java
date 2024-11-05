package com.javaweb.service;

import com.javaweb.dto.request.UserRequest;
import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> search(UserSearchRequest request);

    UserResponse create(UserRequest request);

    UserResponse update(String id, UserRequest request);

    void delete(List<String> ids);

    UserResponse getMyInfo();

    UserResponse getById(String id);
}
