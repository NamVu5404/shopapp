package com.NamVu.service;

import com.NamVu.dto.request.role.RoleRequest;
import com.NamVu.dto.response.role.RoleResponse;

import java.util.List;

public interface RoleService {
    List<RoleResponse> getAll();

    RoleResponse createOrUpdate(RoleRequest request);

    void delete(List<String> codes);
}
