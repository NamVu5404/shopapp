package com.NamVu.service;

import com.NamVu.dto.request.permission.PermissionRequest;
import com.NamVu.dto.response.permission.PermissionResponse;

import java.util.List;

public interface PermissionService {
    List<PermissionResponse> getAll();

    PermissionResponse createOrUpdate(PermissionRequest request);

    void delete(List<String> codes);
}
