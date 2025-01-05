package com.javaweb.service;

import com.javaweb.dto.response.auth.AuthenticationResponse;

public interface OutboundAuthenticationService {
    AuthenticationResponse outboundAuthentication(String code);
}
