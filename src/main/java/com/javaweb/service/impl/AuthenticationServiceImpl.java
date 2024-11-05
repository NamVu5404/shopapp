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
import com.javaweb.utils.BuildScope;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signer-key}")
    String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    Long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    Long REFRESHABLE_DURATION;

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = userRepository.findByUsernameAndStatus(request.getUsername(), (byte) 1)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated)
            throw new CustomException(ErrorCode.UNAUTHENTICATED);

        String token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request)
            throws JOSEException, ParseException {
        boolean isValid = true;

        try {
            verifyToken(request.getToken(), false);
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
            SignedJWT signedJWT = verifyToken(request.getToken(), true); // cần check với tg refresh vì nếu check tg valid, 1 token hết hạn sẽ nhảy vào catch(ko lưu xuống DB) nên vẫn có thể refresh

            String jti = signedJWT.getJWTClaimsSet().getJWTID();
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jti)
                    .expiryTime(expiryTime)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (CustomException e) { // hàm logout ko cần trả response nên ko throw exception
            log.info("Token is invalid");
        }
    }

    @Override
    public RefreshResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        String token = request.getToken();

        SignedJWT signedJWT = verifyToken(token, true);

        // xóa token cũ bằng cách logout
        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        invalidatedTokenRepository.save(InvalidatedToken.builder()
                .id(jti)
                .expiryTime(expiryTime)
                .build());

        // tạo token mới dựa vào subject
        String username = signedJWT.getJWTClaimsSet().getSubject();

        User user = userRepository.findByUsernameAndStatus(username, (byte) 1)
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHENTICATED));

        return RefreshResponse.builder()
                .token(generateToken(user))
                .build();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh)
            throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        Date expirationDate = (isRefresh) ?
                Date.from(signedJWT.getJWTClaimsSet().getIssueTime()
                        .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS))
                : signedJWT.getJWTClaimsSet().getExpirationTime(); // isRefresh: true thì so sánh với tg refresh, false thì sao sánh tg valid

        boolean verified = signedJWT.verify(verifier);

        if (!(verified && expirationDate.after(new Date())))
            throw new CustomException(ErrorCode.UNAUTHENTICATED);

        if (invalidatedTokenRepository.existsById(jti))
            throw new CustomException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    private String generateToken(User user) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .issuer("javaweb.com")
                .subject(user.getUsername())
                .claim("scope", BuildScope.buildScope(user.getRoles()))
                .issueTime(new Date())
                .jwtID(UUID.randomUUID().toString())
                .expirationTime(Date.from(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS)
                ))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }
}
