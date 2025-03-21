package com.NamVu.controller;

import com.NamVu.dto.request.user.GuestCreateRequest;
import com.NamVu.dto.request.user.UserCreateRequest;
import com.NamVu.dto.request.user.UserSearchRequest;
import com.NamVu.dto.request.user.UserUpdateRequest;
import com.NamVu.dto.response.ApiResponse;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.user.UserResponse;
import com.NamVu.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> search(
            UserSearchRequest request,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<UserResponse>>builder()
                .result(userService.search(request, pageable))
                .build();
    }

    @PostMapping
    public ApiResponse<UserResponse> create(@RequestBody @Valid UserCreateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.create(request))
                .build();
    }

    @PostMapping("/guests")
    public ApiResponse<UserResponse> createGuest(@RequestBody @Valid GuestCreateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createGuest(request))
                .build();
    }

    @PostMapping("/{id}")
    public ApiResponse<UserResponse> update(@PathVariable String id, @RequestBody @Valid UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.update(id, request))
                .build();
    }

    @DeleteMapping("/{ids}")
    public ApiResponse<Void> delete(@PathVariable List<String> ids) {
        userService.delete(ids);
        return ApiResponse.<Void>builder()
                .message("Delete successfully")
                .build();
    }

    @GetMapping("/myInfo")
    public ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getById(id))
                .build();
    }
}
