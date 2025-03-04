package com.javaweb.service.impl;

import com.javaweb.constant.StatusConstant;
import com.javaweb.dto.request.password.ChangePasswordRequest;
import com.javaweb.entity.User;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.PasswordService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PasswordServiceImpl implements PasswordService {

    static String DEFAULT_PASSWORD = "12345678";

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsernameAndIsActive(username, StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.OLD_PASSWORD_INCORRECT);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void setPassword(String password) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsernameAndIsActive(username, StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        if (StringUtils.hasText(user.getPassword()))
            throw new CustomException(ErrorCode.PASSWORD_EXISTS);

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void resetPassword(String id) {
        User user = userRepository.findByIdAndIsActive(id, StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        user.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        userRepository.save(user);
    }

    @Override
    public Object forgotPassword(Object object) {
        return null;
    }
}