package com.NamVu.service.impl;

import com.NamVu.converter.PermissionConverter;
import com.NamVu.dto.request.permission.PermissionRequest;
import com.NamVu.dto.response.permission.PermissionResponse;
import com.NamVu.entity.Permission;
import com.NamVu.exception.CustomException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.PermissionRepository;
import com.NamVu.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
