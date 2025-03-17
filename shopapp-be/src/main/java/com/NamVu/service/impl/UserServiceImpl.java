package com.NamVu.service.impl;

import com.NamVu.constant.StatusConstant;
import com.NamVu.converter.UserConverter;
import com.NamVu.dto.request.user.GuestCreateRequest;
import com.NamVu.dto.request.user.UserCreateRequest;
import com.NamVu.dto.request.user.UserSearchRequest;
import com.NamVu.dto.request.user.UserUpdateRequest;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.dto.response.user.UserResponse;
import com.NamVu.entity.User;
import com.NamVu.exception.CustomException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.UserRepository;
import com.NamVu.service.UserService;
import com.NamVu.specifications.UserSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {

    UserRepository userRepository;
    UserConverter userConverter;

    @Override
    @PreAuthorize("hasAuthority('RU_USER')")
    public PageResponse<UserResponse> search(UserSearchRequest request, Pageable pageable) {
        Specification<User> spec = Specification
                .where(UserSpecification.withId(request.getId()))
                .and(UserSpecification.withUsername(request.getUsername()))
                .and(UserSpecification.withFullName(request.getFullName()))
                .and(UserSpecification.withPhone(request.getPhone()))
                .and(UserSpecification.withIsGuest(request.getIsGuest()))
                .and(UserSpecification.withRole(request.getRole()));

        Page<User> users = userRepository.findAll(spec, pageable);

        return PageResponse.<UserResponse>builder()
                .totalPage(users.getTotalPages())
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(users.getTotalElements())
                .data(users.stream().map(userConverter::toResponse).toList())
                .build();
    }

    @Override
    @Transactional
    public UserResponse create(UserCreateRequest request) {
        String username = request.getUsername();

        User user = userRepository.findByUsername(username).orElse(null);

        // Chưa tồn tại user, tạo mới
        if (user == null) {
            return createNewUser(request);
        }

        // Tồn tại user và ko là guest -> throw ex
        if (user.getIsGuest() == StatusConstant.USER) {
            throw new CustomException(ErrorCode.USER_EXISTS);
        }

        // Là guest, -> user
        return upgradeGuestToUser(user, request);
    }

    private UserResponse createNewUser(UserCreateRequest request) {
        User user = userConverter.toEntity(null, request);
        userRepository.save(user);
        return userConverter.toResponse(user);
    }

    private UserResponse upgradeGuestToUser(User existedUser, UserCreateRequest request) {
        User user = userConverter.toEntity(existedUser, request);
        userRepository.save(user);
        return userConverter.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createGuest(GuestCreateRequest request) {
        User user = userConverter.toEntity(request);
        userRepository.save(user);
        return userConverter.toResponse(user);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('RU_USER') or authentication.name == #request.username")
    public UserResponse update(String id, UserUpdateRequest request) {
        User currentUser = userRepository.findByIdAndIsActive(id, StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        User updatedUser = userConverter.toEntity(currentUser, request);

        userRepository.save(updatedUser);

        return userConverter.toResponse(updatedUser);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(List<String> ids) {
        List<User> users = ids.stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS)))
                .collect(Collectors.toList());

        users.forEach(user -> user.setIsActive(StatusConstant.INACTIVE));
        userRepository.saveAll(users);
    }

    @Override
    public UserResponse getMyInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsernameAndIsActive(username, StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        return userConverter.toResponse(user);
    }

    @Override
    @PreAuthorize("hasAuthority('RU_USER')")
    public UserResponse getById(String id) {
        return userConverter.toResponse(
                userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS)));
    }
}