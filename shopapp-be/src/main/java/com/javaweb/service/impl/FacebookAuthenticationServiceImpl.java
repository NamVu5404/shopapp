package com.javaweb.service.impl;

import com.javaweb.clients.facebook.FacebookAuthClient;
import com.javaweb.clients.facebook.FacebookUserClient;
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

@Service("facebook")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FacebookAuthenticationServiceImpl implements OutboundAuthenticationService {

    FacebookAuthClient facebookAuthClient;
    FacebookUserClient facebookUserClient;
    TokenService tokenService;
    OutboundUserService outboundUserService;

    @NonFinal
    @Value("${outbound.facebook.client-id}")
    String FACEBOOK_CLIENT_ID;

    @NonFinal
    @Value("${outbound.facebook.client-secret}")
    String FACEBOOK_CLIENT_SECRET;

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
        return facebookAuthClient.exchangeToken(ExchangeTokenRequest.builder()
                .clientId(FACEBOOK_CLIENT_ID)
                .clientSecret(FACEBOOK_CLIENT_SECRET)
                .code(code)
                .grantType(GRANT_TYPE)
                .redirectUri(REDIRECT_URI)
                .build());
    }

    private OutboundUserResponse getUserInfo(ExchangeTokenResponse response) {
        return facebookUserClient.getUserInfo("email,name", response.getAccessToken());
    }
}
