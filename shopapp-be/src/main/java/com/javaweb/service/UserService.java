package com.javaweb.service;

import com.javaweb.dto.request.user.GuestCreateRequest;
import com.javaweb.dto.request.user.UserCreateRequest;
import com.javaweb.dto.request.user.UserSearchRequest;
import com.javaweb.dto.request.user.UserUpdateRequest;
import com.javaweb.dto.response.PageResponse;
import com.javaweb.dto.response.user.UserResponse;

import java.util.List;

public interface UserService {
    PageResponse<UserResponse> search(UserSearchRequest request, int page, int size);

    UserResponse create(UserCreateRequest request);

    UserResponse createGuest(GuestCreateRequest request);

    UserResponse update(String id, UserUpdateRequest request);

    void delete(List<String> ids);

    UserResponse getMyInfo();

    UserResponse getById(String id);
}
