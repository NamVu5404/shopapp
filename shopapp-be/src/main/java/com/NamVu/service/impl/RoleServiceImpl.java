package com.NamVu.service.impl;

import com.NamVu.converter.RoleConverter;
import com.NamVu.dto.request.role.RoleRequest;
import com.NamVu.dto.response.role.RoleResponse;
import com.NamVu.entity.Role;
import com.NamVu.exception.CustomException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.RoleRepository;
import com.NamVu.service.RoleService;
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
public class RoleServiceImpl implements RoleService {
    RoleConverter roleConverter;
    RoleRepository roleRepository;

    @Override
    public List<RoleResponse> getAll() {
        return roleRepository.findAll()
                .stream()
                .map(roleConverter::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public RoleResponse createOrUpdate(RoleRequest request) {
        String id = request.getId();

        if (id == null && roleRepository.existsByCode(request.getCode())) {
            throw new CustomException(ErrorCode.ROLE_EXISTS);
        } else if (id != null && !roleRepository.existsById(id)) {
            throw new CustomException(ErrorCode.ROLE_NOT_EXISTS);
        }

        Role role = roleConverter.toEntity(request);
        roleRepository.save(role);

        return roleConverter.toResponse(role);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(List<String> codes) {
        if (roleRepository.existsByCodeInAndUsersIsNotEmpty(codes)) {
            throw new CustomException(ErrorCode.INVALID_DELETE_ROLE);
        }

        codes.forEach(code -> {
            if (!roleRepository.existsByCode(code)) {
                throw new CustomException(ErrorCode.ROLE_NOT_EXISTS);
            }
        });

        roleRepository.deleteByCodeIn(codes);
    }
}
