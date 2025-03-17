package com.NamVu.service;

import com.NamVu.dto.response.user.OutboundUserResponse;
import com.NamVu.entity.User;

public interface OutboundUserService {
    User onboardUser(OutboundUserResponse userInfo);
}
