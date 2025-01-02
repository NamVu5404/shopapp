package com.javaweb.controller;

import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.AuthenticationResponse;
import com.javaweb.service.OutboundAuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth/outbound")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OutboundAuthenticationController {

    Map<String, OutboundAuthenticationService> authenticationServiceMap;

    @PostMapping("/authentication")
    ApiResponse<AuthenticationResponse> outboundAuthentication(@RequestParam("provider") String provider,
                                                               @RequestParam("code") String code) {

        OutboundAuthenticationService selectedService = authenticationServiceMap.get(provider);

        AuthenticationResponse result = selectedService.outboundAuthentication(code);

        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
}
