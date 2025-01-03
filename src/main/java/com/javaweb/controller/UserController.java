package com.javaweb.controller;

import com.javaweb.dto.request.user.*;
import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.user.UserResponse;
import com.javaweb.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @GetMapping
    public ApiResponse<List<UserResponse>> search(UserSearchRequest request) {
        List<UserResponse> result = userService.search(request);

        return ApiResponse.<List<UserResponse>>builder()
                .result(result)
                .build();
    }

    @PostMapping
    public ApiResponse<UserResponse> create(@RequestBody @Valid UserCreateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.create(request))
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

    @PostMapping("/myInfo/password")
    public ApiResponse<Void> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(request);

        return ApiResponse.<Void>builder()
                .message("Change password successfully")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getById(id))
                .build();
    }

    /*
     * set password cho user login bằng bên thứ 3
     */
    @PostMapping("/set-password")
    public ApiResponse<Void> setPassword(@RequestBody @Valid SetPasswordRequest request) {
        userService.setPassword(request.getPassword());

        return ApiResponse.<Void>builder()
                .message("Set password successfully")
                .build();
    }
}
