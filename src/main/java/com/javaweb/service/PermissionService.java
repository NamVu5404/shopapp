package com.javaweb.service;

import com.javaweb.dto.request.PermissionRequest;
import com.javaweb.dto.response.PermissionResponse;

import java.util.List;

public interface PermissionService {
    List<PermissionResponse> getAll();
    PermissionResponse createOrUpdate(PermissionRequest request);
    void delete(List<String> codes);
}
