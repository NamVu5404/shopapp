package com.NamVu.service.impl;

import com.NamVu.dto.response.user.OutboundUserResponse;
import com.NamVu.entity.Role;
import com.NamVu.entity.User;
import com.NamVu.repository.RoleRepository;
import com.NamVu.repository.UserRepository;
import com.NamVu.service.OutboundUserService;
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
                                .fullName(userInfo.getName())
                                .isActive((byte) 1)
                                .roles(roles)
                                .build()
                )
        );
    }
}
