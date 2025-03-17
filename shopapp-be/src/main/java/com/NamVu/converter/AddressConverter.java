package com.NamVu.converter;

import com.NamVu.constant.StatusConstant;
import com.NamVu.dto.request.address.AddressCreateRequest;
import com.NamVu.dto.request.address.AddressUpdateRequest;
import com.NamVu.dto.response.address.AddressResponse;
import com.NamVu.entity.Address;
import com.NamVu.entity.User;
import com.NamVu.exception.CustomException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.UserRepository;
import com.NamVu.utils.AddressUtils;
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
