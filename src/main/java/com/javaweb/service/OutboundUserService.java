package com.javaweb.service;

import com.javaweb.dto.response.OutboundUserResponse;
import com.javaweb.entity.User;

public interface OutboundUserService {
    User onboardUser(OutboundUserResponse userInfo);
}
