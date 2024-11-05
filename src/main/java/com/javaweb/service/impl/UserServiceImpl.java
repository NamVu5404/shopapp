package com.javaweb.service.impl;

import com.javaweb.converter.UserConverter;
import com.javaweb.entity.User;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.dto.request.UserRequest;
import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.response.UserResponse;
import com.javaweb.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements com.javaweb.service.UserService {

    UserRepository userRepository;
    UserConverter userConverter;

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public List<UserResponse> find(UserSearchRequest request) {
        List<User> users = userRepository.findAll(request);
        return users.stream().map(userConverter::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse createOrUpdate(UserRequest request) {
        String id = request.getId();

        if (id == null && userRepository.existsByUsername(request.getUsername())) {
            throw new CustomException(ErrorCode.USER_EXISTS);
        } else if (id != null && !userRepository.existsById(id)) {
            throw new CustomException(ErrorCode.USER_NOT_EXISTS);
        }

        User user = userConverter.toEntity(request);
        userRepository.save(user);

        return userConverter.toResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    @Transactional
    public void delete(List<String> ids) {
        List<User> users = ids.stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS)))
                .collect(Collectors.toList());

        users.forEach(user -> user.setStatus((byte) 0));
        userRepository.saveAll(users);
    }

    @Override
    public UserResponse getMyInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        return userConverter.toResponse(user);
    }
}