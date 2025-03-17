package com.NamVu.clients.google;

import com.NamVu.dto.response.user.OutboundUserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "google-user-client", url = "https://www.googleapis.com")
public interface GoogleUserClient {
    @GetMapping("//oauth2/v1/userinfo")
    OutboundUserResponse getUserInfo(@RequestParam("access_token") String accessToken);
}
