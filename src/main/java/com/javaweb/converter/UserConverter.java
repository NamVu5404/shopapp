package com.javaweb.converter;

import com.javaweb.entity.Role;
import com.javaweb.entity.User;
import com.javaweb.dto.request.UserRequest;
import com.javaweb.dto.response.UserResponse;
import com.javaweb.repository.RoleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    public UserResponse toResponse(User user) {
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);

        List<Role> roles = roleRepository.findByUsers_Id(user.getId());

        List<String> codes = roles.stream().map(Role::getCode).collect(Collectors.toList());
        userResponse.setRoles(codes);

        return userResponse;
    }

    public User toEntity(UserRequest userRequest) {
        User user = modelMapper.map(userRequest, User.class);

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        List<Role> roles = userRequest.getRoles().stream()
                .map(roleRepository::findByCode)
                .collect(Collectors.toList());
        user.setRoles(roles);

        return user;
    }
}
