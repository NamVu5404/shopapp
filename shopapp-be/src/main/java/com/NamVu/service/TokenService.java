package com.NamVu.service;

import com.NamVu.entity.User;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;

import java.text.ParseException;

public interface TokenService {
    String generateToken(User user);

    SignedJWT verifyToken(String token, boolean isRefresh) throws ParseException, JOSEException;
}
