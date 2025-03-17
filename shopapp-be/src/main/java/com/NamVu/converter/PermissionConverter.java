package com.NamVu.converter;

import com.NamVu.dto.request.permission.PermissionRequest;
import com.NamVu.dto.response.permission.PermissionResponse;
import com.NamVu.entity.Permission;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PermissionConverter {
    @Autowired
    private ModelMapper modelMapper;

    public PermissionResponse toResponse(Permission permission) {
        return modelMapper.map(permission, PermissionResponse.class);
    }

    public Permission toEntity(PermissionRequest permissionRequest) {
        return modelMapper.map(permissionRequest, Permission.class);
    }
}
