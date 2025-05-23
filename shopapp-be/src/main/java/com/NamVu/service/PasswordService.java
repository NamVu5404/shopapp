package com.NamVu.service;

import com.NamVu.dto.request.password.ChangePasswordRequest;

public interface PasswordService {
    void changePassword(ChangePasswordRequest request);

    void setPassword(String password);

    void resetPassword(String id);

    Object forgotPassword(Object object);
}
