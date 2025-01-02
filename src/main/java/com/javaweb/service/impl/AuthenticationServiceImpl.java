package com.javaweb.service.impl;

import com.javaweb.dto.request.AuthenticationRequest;
import com.javaweb.dto.request.IntrospectRequest;
import com.javaweb.dto.request.LogoutRequest;
import com.javaweb.dto.request.RefreshRequest;
import com.javaweb.dto.response.AuthenticationResponse;
import com.javaweb.dto.response.IntrospectResponse;
import com.javaweb.dto.response.RefreshResponse;
import com.javaweb.entity.InvalidatedToken;
import com.javaweb.entity.User;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.InvalidatedTokenRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.AuthenticationService;
import com.javaweb.service.TokenService;
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
        User user = userRepository.findByUsernameAndIsActive(request.getUsername(), (byte) 1)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated)
            throw new CustomException(ErrorCode.UNAUTHENTICATED);

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
        } catch (CustomException e) {
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
                    .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS));

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jti)
                    .expiryTime(expiryTime)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (CustomException e) {
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
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS));

        invalidatedTokenRepository.save(InvalidatedToken.builder()
                .id(jti)
                .expiryTime(expiryTime)
                .build());

        // tạo token mới dựa vào subject
        String username = signedJWT.getJWTClaimsSet().getSubject();

        User user = userRepository.findByUsernameAndIsActive(username, (byte) 1)
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHENTICATED));

        return RefreshResponse.builder()
                .token(tokenService.generateToken(user))
                .build();
    }
}
