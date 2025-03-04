package com.javaweb.controller;

import com.javaweb.dto.request.permission.PermissionRequest;
import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.permission.PermissionResponse;
import com.javaweb.service.PermissionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {

    PermissionService permissionService;

    @GetMapping
    public ApiResponse<List<PermissionResponse>> getAll() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionService.getAll())
                .build();
    }

    @PostMapping
    public ApiResponse<PermissionResponse> createOrUpdate(@RequestBody @Valid PermissionRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.createOrUpdate(request))
                .build();
    }

    @DeleteMapping("/{codes}")
    public ApiResponse<Void> delete(@PathVariable List<String> codes) {
        permissionService.delete(codes);

        return ApiResponse.<Void>builder()
                .message("Delete successfully")
                .build();
    }

}
