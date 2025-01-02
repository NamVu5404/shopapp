package com.javaweb.clients.google;

import com.javaweb.dto.request.ExchangeTokenRequest;
import com.javaweb.dto.response.ExchangeTokenResponse;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "google-auth-client", url = "https://oauth2.googleapis.com")
public interface GoogleAuthClient {
    /*
     * client-side: gửi request nhận response
     * Post request(code, ...) lên token_uri để exchange Token
     */
    @PostMapping(value = "/token", produces = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    ExchangeTokenResponse exchangeToken(@QueryMap ExchangeTokenRequest request);
}
