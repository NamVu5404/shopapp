package com.javaweb.converter;

import com.javaweb.dto.request.user.UserCreateRequest;
import com.javaweb.dto.request.user.UserUpdateRequest;
import com.javaweb.dto.response.user.UserResponse;
import com.javaweb.entity.Role;
import com.javaweb.entity.User;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.RoleRepository;
import com.javaweb.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserConverter {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public UserResponse toResponse(User user) {
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);

        List<Role> roles = roleRepository.findByUsers_Id(user.getId());

        List<String> codes = roles.stream().map(Role::getCode).collect(Collectors.toList());
        userResponse.setRoles(codes);

        return userResponse;
    }

    public User toEntity(UserCreateRequest request) {
        User user = modelMapper.map(request, User.class);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        List<Role> roles = request.getRoles().stream()
                .map(roleRepository::findByCode)
                .collect(Collectors.toList());
        user.setRoles(roles);

        return user;
    }

    public User toEntity(String id, UserUpdateRequest request) {
        User user = userRepository.findByIdAndIsActive(id, (byte) 1)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        modelMapper.map(request, user);

        List<Role> roles = request.getRoles().stream()
                .map(roleRepository::findByCode)
                .collect(Collectors.toList());
        user.setRoles(roles);

        return user;
    }
}
