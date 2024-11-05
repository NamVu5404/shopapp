package com.javaweb.service;

import com.javaweb.dto.request.AuthenticationRequest;
import com.javaweb.dto.request.IntrospectRequest;
import com.javaweb.dto.request.LogoutRequest;
import com.javaweb.dto.request.RefreshRequest;
import com.javaweb.dto.response.AuthenticationResponse;
import com.javaweb.dto.response.IntrospectResponse;
import com.javaweb.dto.response.RefreshResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);

    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;

    void logout(LogoutRequest request) throws ParseException, JOSEException;

    RefreshResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException;
}
