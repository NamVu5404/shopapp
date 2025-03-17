package com.NamVu.service;

import com.NamVu.dto.request.address.AddressCreateRequest;
import com.NamVu.dto.request.address.AddressUpdateRequest;
import com.NamVu.dto.response.address.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getAllByUserId(String userId);

    AddressResponse create(AddressCreateRequest request);

    AddressResponse update(String addressId, AddressUpdateRequest request);

    void delete(String addressId);
}
