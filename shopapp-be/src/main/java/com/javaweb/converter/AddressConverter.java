package com.javaweb.converter;

import com.javaweb.constant.StatusConstant;
import com.javaweb.dto.request.address.AddressCreateRequest;
import com.javaweb.dto.request.address.AddressUpdateRequest;
import com.javaweb.dto.response.address.AddressResponse;
import com.javaweb.entity.Address;
import com.javaweb.entity.User;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.UserRepository;
import com.javaweb.utils.AddressUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AddressConverter {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepository userRepository;

    // create
    public Address toEntity(AddressCreateRequest request) {
        User user = userRepository.findByIdAndIsActive(request.getUserId(), StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        Address address = modelMapper.map(request, Address.class);
        address.setUser(user);
        address.setKey(AddressUtils.generateUniqueAddressKey(address));

        return address;
    }

    // update
    public Address toEntity(Address address, AddressUpdateRequest request) {
        modelMapper.map(request, address);
        address.setKey(AddressUtils.generateUniqueAddressKey(address));
        return address;
    }

    public AddressResponse toResponse(Address address) {
        AddressResponse response = modelMapper.map(address, AddressResponse.class);
        response.setUserId(address.getUser().getId());
        return response;
    }
}
