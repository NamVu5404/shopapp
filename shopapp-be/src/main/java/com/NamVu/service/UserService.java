package com.NamVu.service;

import com.NamVu.dto.request.user.GuestCreateRequest;
import com.NamVu.dto.request.user.UserCreateRequest;
import com.NamVu.dto.request.user.UserSearchRequest;
import com.NamVu.dto.request.user.UserUpdateRequest;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.user.UserResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    PageResponse<UserResponse> search(UserSearchRequest request, Pageable pageable);

    UserResponse create(UserCreateRequest request);

    UserResponse createGuest(GuestCreateRequest request);

    UserResponse update(String id, UserUpdateRequest request);

    void delete(List<String> ids);

    UserResponse getMyInfo();

    UserResponse getById(String id);
}
