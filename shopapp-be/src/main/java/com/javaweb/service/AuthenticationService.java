package com.javaweb.service;

import com.javaweb.dto.request.auth.AuthenticationRequest;
import com.javaweb.dto.request.auth.IntrospectRequest;
import com.javaweb.dto.request.auth.LogoutRequest;
import com.javaweb.dto.request.auth.RefreshRequest;
import com.javaweb.dto.response.auth.AuthenticationResponse;
import com.javaweb.dto.response.auth.IntrospectResponse;
import com.javaweb.dto.response.auth.RefreshResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);

    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;

    void logout(LogoutRequest request) throws ParseException, JOSEException;

    RefreshResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException;
}
