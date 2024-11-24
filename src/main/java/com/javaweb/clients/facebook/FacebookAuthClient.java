package com.javaweb.clients.facebook;

import com.javaweb.dto.request.ExchangeTokenRequest;
import com.javaweb.dto.response.ExchangeTokenResponse;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "facebook-auth-client", url = "https://graph.facebook.com/v21.0")
public interface FacebookAuthClient {
    @PostMapping(value = "/oauth/access_token", produces = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    ExchangeTokenResponse exchangeToken(@QueryMap ExchangeTokenRequest request);
}
