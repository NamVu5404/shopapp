package com.javaweb.controller;

import com.javaweb.dto.request.UserRequest;
import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.UserResponse;
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
    public ApiResponse<UserResponse> create(@RequestBody @Valid UserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.create(request))
                .build();
    }

    @PostMapping("/{id}")
    public ApiResponse<UserResponse> update(@PathVariable String id, @RequestBody @Valid UserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.update(id, request))
                .build();
    }

    @DeleteMapping("/{ids}")
    public ApiResponse<String> delete(@PathVariable List<String> ids) {
        userService.delete(ids);
        return ApiResponse.<String>builder()
                .result("Delete successfully")
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
