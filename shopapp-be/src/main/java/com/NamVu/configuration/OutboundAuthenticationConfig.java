package com.NamVu.configuration;

import com.NamVu.service.OutboundAuthenticationService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class OutboundAuthenticationConfig {

    @Bean
    public Map<String, OutboundAuthenticationService> authenticationServiceMap(
            @Qualifier("google") OutboundAuthenticationService googleAuthenticationServiceImpl,
            @Qualifier("facebook") OutboundAuthenticationService facebookAuthenticationServiceImpl) {

        Map<String, OutboundAuthenticationService> authenticationServiceMap = new HashMap<>();
        authenticationServiceMap.put("google", googleAuthenticationServiceImpl);
        authenticationServiceMap.put("facebook", facebookAuthenticationServiceImpl);

        return authenticationServiceMap;
    }
}
