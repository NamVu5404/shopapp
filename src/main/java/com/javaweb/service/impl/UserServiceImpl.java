package com.javaweb.service.impl;

import com.javaweb.converter.UserConverter;
import com.javaweb.dto.request.UserRequest;
import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.response.UserResponse;
import com.javaweb.entity.User;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {

    UserRepository userRepository;
    UserConverter userConverter;
    PasswordEncoder passwordEncoder;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> search(UserSearchRequest request) {
        List<User> users = userRepository.findAll(request);
        return users.stream()
                .map(userConverter::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new CustomException(ErrorCode.USER_EXISTS);

        User user = userConverter.toEntity(request);
        userRepository.save(user);

        return userConverter.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse update(String id, UserRequest request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!currentUsername.equals(request.getUsername()))
            throw new CustomException(ErrorCode.UNAUTHORIZED);

        if (!userRepository.existsByIdAndIsActive(id, (byte) 1))
            throw new CustomException(ErrorCode.USER_NOT_EXISTS);
        request.setId(id);

        User user = userConverter.toEntity(request);
        userRepository.save(user);

        return userConverter.toResponse(user);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(List<String> ids) {
        List<User> users = ids.stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS)))
                .collect(Collectors.toList());

        users.forEach(user -> user.setIsActive((byte) 0));
        userRepository.saveAll(users);
    }

    @Override
    public UserResponse getMyInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsernameAndIsActive(username, (byte) 1)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        UserResponse userResponse = userConverter.toResponse(user);
        userResponse.setHasPassword(StringUtils.hasText(user.getPassword()));

        return userResponse;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getById(String id) {
        return userConverter.toResponse(
                userRepository.findByIdAndIsActive(id, (byte) 1)
                        .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS))
        );
    }

    @Override
    @Transactional
    public void setPassword(String password) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsernameAndIsActive(username, (byte) 1)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        if (StringUtils.hasText(user.getPassword()))
            throw new CustomException(ErrorCode.PASSWORD_EXISTS);

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }
}