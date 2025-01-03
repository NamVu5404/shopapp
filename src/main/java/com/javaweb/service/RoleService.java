package com.javaweb.service;

import com.javaweb.dto.request.role.RoleRequest;
import com.javaweb.dto.response.role.RoleResponse;

import java.util.List;

public interface RoleService {
    List<RoleResponse> getAll();

    RoleResponse createOrUpdate(RoleRequest request);

    void delete(List<String> codes);
}
