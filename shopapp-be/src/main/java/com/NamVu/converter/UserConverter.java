package com.NamVu.converter;

import com.NamVu.constant.StatusConstant;
import com.NamVu.dto.request.user.GuestCreateRequest;
import com.NamVu.dto.request.user.UserCreateRequest;
import com.NamVu.dto.request.user.UserUpdateRequest;
import com.NamVu.dto.response.user.UserResponse;
import com.NamVu.entity.Role;
import com.NamVu.entity.User;
import com.NamVu.repository.RoleRepository;
import com.NamVu.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Collections;
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

        userResponse.setHasPassword(StringUtils.hasText(user.getPassword()));

        return userResponse;
    }

    // new user, guest -> user
    public User toEntity(User existedUser, UserCreateRequest request) {
        User user = (existedUser == null) ? new User() : existedUser;
        modelMapper.map(request, user);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRoles(getListRolesByCodes(request.getRoles()));

        user.setIsGuest(StatusConstant.USER);

        return user;
    }

    // new guest
    public User toEntity(GuestCreateRequest request) {
        return userRepository.findByUsername(request.getUsername()).orElseGet(
                () -> {
                    User user = modelMapper.map(request, User.class);
                    user.setIsGuest(StatusConstant.GUEST);
                    user.setRoles(Collections.singletonList(roleRepository.findByCode("CUSTOMER")));
                    return user;
                }
        );
    }

    // update
    public User toEntity(User user, UserUpdateRequest request) {
        modelMapper.map(request, user);

        user.setRoles(getListRolesByCodes(request.getRoles()));

        return user;
    }

    private List<Role> getListRolesByCodes(List<String> codes) {
        return codes.stream()
                .map(roleRepository::findByCode)
                .collect(Collectors.toList());
    }
}
