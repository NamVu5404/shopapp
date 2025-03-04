package com.javaweb.controller;

import com.javaweb.dto.request.address.AddressCreateRequest;
import com.javaweb.dto.request.address.AddressUpdateRequest;
import com.javaweb.dto.response.ApiResponse;
import com.javaweb.dto.response.address.AddressResponse;
import com.javaweb.service.AddressService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressController {
    AddressService addressService;

    @GetMapping
    public ApiResponse<List<AddressResponse>> getAllByUserId(@RequestParam("userId") String userId) {
        return ApiResponse.<List<AddressResponse>>builder()
                .result(addressService.getAllByUserId(userId))
                .build();
    }

    @PostMapping
    public ApiResponse<AddressResponse> create(@RequestBody @Valid AddressCreateRequest request) {
        return ApiResponse.<AddressResponse>builder()
                .result(addressService.create(request))
                .build();
    }

    @PostMapping("/{addressId}")
    public ApiResponse<AddressResponse> update(@PathVariable String addressId,
                                               @RequestBody @Valid AddressUpdateRequest request) {
        return ApiResponse.<AddressResponse>builder()
                .result(addressService.update(addressId, request))
                .build();
    }

    @DeleteMapping("/{addressId}")
    public ApiResponse<Void> delete(@PathVariable String addressId) {
        addressService.delete(addressId);

        return ApiResponse.<Void>builder()
                .message("Delete successfully")
                .build();
    }
}
