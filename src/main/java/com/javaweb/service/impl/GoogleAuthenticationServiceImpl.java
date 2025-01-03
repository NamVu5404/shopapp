package com.javaweb.service.impl;

import com.javaweb.clients.google.GoogleAuthClient;
import com.javaweb.clients.google.GoogleUserClient;
import com.javaweb.dto.request.auth.ExchangeTokenRequest;
import com.javaweb.dto.response.auth.AuthenticationResponse;
import com.javaweb.dto.response.auth.ExchangeTokenResponse;
import com.javaweb.dto.response.user.OutboundUserResponse;
import com.javaweb.entity.User;
import com.javaweb.service.OutboundAuthenticationService;
import com.javaweb.service.OutboundUserService;
import com.javaweb.service.TokenService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service("google")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GoogleAuthenticationServiceImpl implements OutboundAuthenticationService {

    GoogleAuthClient googleAuthClient;
    GoogleUserClient googleUserClient;
    TokenService tokenService;
    OutboundUserService outboundUserService;

    @NonFinal
    @Value("${outbound.google.client-id}")
    String GOOGLE_CLIENT_ID;

    @NonFinal
    @Value("${outbound.google.client-secret}")
    String GOOGLE_CLIENT_SECRET;

    @NonFinal
    @Value("${outbound.redirect-uri}")
    String REDIRECT_URI;

    @NonFinal
    String GRANT_TYPE = "authorization_code";

    @Override
    public AuthenticationResponse outboundAuthentication(String code) {
        // Exchange token
        ExchangeTokenResponse response = exchangeToken(code);

        // Get user info
        OutboundUserResponse userInfo = getUserInfo(response);

        // Onboard user
        User user = outboundUserService.onboardUser(userInfo);

        // Generate JWT Token
        String token = tokenService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    private ExchangeTokenResponse exchangeToken(String code) {
        return googleAuthClient.exchangeToken(ExchangeTokenRequest.builder()
                .clientId(GOOGLE_CLIENT_ID)
                .clientSecret(GOOGLE_CLIENT_SECRET)
                .code(code)
                .grantType(GRANT_TYPE)
                .redirectUri(REDIRECT_URI)
                .build());
    }

    private OutboundUserResponse getUserInfo(ExchangeTokenResponse response) {
        return googleUserClient.getUserInfo(response.getAccessToken());
    }
}
