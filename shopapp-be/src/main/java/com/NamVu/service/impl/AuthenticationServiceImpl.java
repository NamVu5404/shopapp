package com.NamVu.service.impl;

import com.NamVu.constant.StatusConstant;
import com.NamVu.dto.request.auth.AuthenticationRequest;
import com.NamVu.dto.request.auth.IntrospectRequest;
import com.NamVu.dto.request.auth.LogoutRequest;
import com.NamVu.dto.request.auth.RefreshRequest;
import com.NamVu.dto.response.auth.AuthenticationResponse;
import com.NamVu.dto.response.auth.IntrospectResponse;
import com.NamVu.dto.response.auth.RefreshResponse;
import com.NamVu.entity.InvalidatedToken;
import com.NamVu.entity.User;
import com.NamVu.exception.AppException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.InvalidatedTokenRepository;
import com.NamVu.repository.UserRepository;
import com.NamVu.service.AuthenticationService;
import com.NamVu.service.TokenService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    UserRepository userRepository;
    TokenService tokenService;
    PasswordEncoder passwordEncoder;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    Long REFRESHABLE_DURATION;

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = userRepository.findByUsernameAndIsActive(request.getUsername(), StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        String token = tokenService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        boolean isValid = true;

        try {
            tokenService.verifyToken(request.getToken(), false);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    @Override
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try { // lưu id(jti) của token xuống DB khi logout để check 1 token đã logout chưa
            SignedJWT signedJWT = tokenService.verifyToken(request.getToken(), true); // cần check với refresh token. Vì nếu check access token, 1 token hết hạn sẽ nhảy vào catch(ko lưu xuống DB) nên vẫn có thể refresh

            String jti = signedJWT.getJWTClaimsSet().getJWTID();
            Date expiryTime = Date.from(signedJWT.getJWTClaimsSet().getIssueTime()
                    .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.HOURS));

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jti)
                    .expiryTime(expiryTime)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException e) {
            log.info("Token is invalid");
        }
    }

    @Override
    public RefreshResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        String token = request.getToken();

        SignedJWT signedJWT = tokenService.verifyToken(token, true);

        // xóa token cũ bằng cách logout
        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = Date.from(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.HOURS));

        invalidatedTokenRepository.save(InvalidatedToken.builder()
                .id(jti)
                .expiryTime(expiryTime)
                .build());

        // tạo token mới dựa vào subject
        String username = signedJWT.getJWTClaimsSet().getSubject();

        User user = userRepository.findByUsernameAndIsActive(username, StatusConstant.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        return RefreshResponse.builder()
                .token(tokenService.generateToken(user))
                .build();
    }
}
