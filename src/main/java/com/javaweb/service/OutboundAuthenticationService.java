package com.javaweb.service;

import com.javaweb.dto.response.AuthenticationResponse;

public interface OutboundAuthenticationService {
    AuthenticationResponse outboundAuthentication(String code);
}
