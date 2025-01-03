package com.javaweb.service;

import com.javaweb.dto.request.permission.PermissionRequest;
import com.javaweb.dto.response.permission.PermissionResponse;

import java.util.List;

public interface PermissionService {
    List<PermissionResponse> getAll();

    PermissionResponse createOrUpdate(PermissionRequest request);

    void delete(List<String> codes);
}
