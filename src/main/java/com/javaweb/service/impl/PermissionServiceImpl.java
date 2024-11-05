package com.javaweb.service.impl;

import com.javaweb.converter.PermissionConverter;
import com.javaweb.dto.request.PermissionRequest;
import com.javaweb.dto.response.PermissionResponse;
import com.javaweb.entity.Permission;
import com.javaweb.entity.Role;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.PermissionRepository;
import com.javaweb.repository.RoleRepository;
import com.javaweb.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionServiceImpl implements PermissionService {

    PermissionRepository permissionRepository;
    PermissionConverter permissionConverter;

    @Override
    public List<PermissionResponse> getAll() {
        return permissionRepository.findAll()
                .stream()
                .map(permissionConverter::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PermissionResponse createOrUpdate(PermissionRequest request) {
        String id = request.getId();

        if (id == null && permissionRepository.existsByCode(request.getCode())) {
            throw new CustomException(ErrorCode.PERMISSION_EXISTS);
        } else if (id != null && !permissionRepository.existsById(id)) {
            throw new CustomException(ErrorCode.PERMISSION_NOT_EXISTS);
        }

        Permission permission = permissionConverter.toEntity(request);
        permissionRepository.save(permission);

        return permissionConverter.toResponse(permission);
    }

    @Override
    @Transactional
    public void delete(List<String> codes) {
        if (permissionRepository.existsByCodeInAndRolesIsNotEmpty(codes)) {
            throw new CustomException(ErrorCode.INVALID_DELETE_PERMISSION);
        }

        codes.forEach(code -> {
            if (!permissionRepository.existsByCode(code)) {
                throw new CustomException(ErrorCode.PERMISSION_NOT_EXISTS);
            }
        });

        permissionRepository.deleteByCodeIn(codes);
    }
}
