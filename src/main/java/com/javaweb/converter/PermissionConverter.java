package com.javaweb.converter;

import com.javaweb.dto.request.PermissionRequest;
import com.javaweb.dto.response.PermissionResponse;
import com.javaweb.entity.Permission;
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
