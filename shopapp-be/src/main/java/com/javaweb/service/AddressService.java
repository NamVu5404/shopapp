package com.javaweb.service;

import com.javaweb.dto.request.address.AddressCreateRequest;
import com.javaweb.dto.request.address.AddressUpdateRequest;
import com.javaweb.dto.response.address.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getAllByUserId(String userId);

    AddressResponse create(AddressCreateRequest request);

    AddressResponse update(String addressId, AddressUpdateRequest request);

    void delete(String addressId);
}
