package com.NamVu.controller;

import com.NamVu.dto.request.password.ChangePasswordRequest;
import com.NamVu.dto.request.password.SetPasswordRequest;
import com.NamVu.dto.response.ApiResponse;
import com.NamVu.service.PasswordService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/password")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PasswordController {

    PasswordService passwordService;

    @PostMapping("/change")
    public ApiResponse<Void> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        passwordService.changePassword(request);

        return ApiResponse.<Void>builder()
                .message("Change password successfully")
                .build();
    }

    /*
     * set password cho user login bằng bên thứ 3
     */
    @PostMapping("/set")
    public ApiResponse<Void> setPassword(@RequestBody @Valid SetPasswordRequest request) {
        passwordService.setPassword(request.getPassword());

        return ApiResponse.<Void>builder()
                .message("Set password successfully")
                .build();
    }

    @PostMapping("/reset/{id}")
    public ApiResponse<Void> resetPassword(@PathVariable String id) {
        passwordService.resetPassword(id);

        return ApiResponse.<Void>builder()
                .message("Default password: 12345678")
                .build();
    }

    @PostMapping("/forgot")
    public ApiResponse<Object> forgotPassword(@RequestBody @Valid Object object) {
        var result = passwordService.forgotPassword(object);

        return ApiResponse.builder()
                .result(result)
                .build();
    }
}
