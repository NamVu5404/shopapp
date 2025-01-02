package com.javaweb.service.impl;

import com.javaweb.dto.response.OutboundUserResponse;
import com.javaweb.entity.Role;
import com.javaweb.entity.User;
import com.javaweb.repository.RoleRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.OutboundUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OutboundUserServiceImpl implements OutboundUserService {
    UserRepository userRepository;
    RoleRepository roleRepository;

    @Override
    public User onboardUser(OutboundUserResponse userInfo) {
        List<Role> roles = Collections.singletonList(roleRepository.findByCode("CUSTOMER"));
        return userRepository.findByUsername(userInfo.getEmail()).orElseGet(
                () -> userRepository.save(
                        User.builder()
                                .username(userInfo.getEmail())
                                .email(userInfo.getEmail())
                                .fullName(userInfo.getName())
                                .isActive((byte) 1)
                                .roles(roles)
                                .build()
                )
        );
    }
}
