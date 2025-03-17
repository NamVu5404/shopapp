package com.NamVu.service.impl;

import com.NamVu.constant.StatusConstant;
import com.NamVu.converter.AddressConverter;
import com.NamVu.dto.request.address.AddressCreateRequest;
import com.NamVu.dto.request.address.AddressUpdateRequest;
import com.NamVu.dto.response.address.AddressResponse;
import com.NamVu.entity.Address;
import com.NamVu.entity.User;
import com.NamVu.exception.CustomException;
import com.NamVu.exception.ErrorCode;
import com.NamVu.repository.AddressRepository;
import com.NamVu.repository.UserRepository;
import com.NamVu.service.AddressService;
import com.NamVu.utils.AuthUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AddressServiceImpl implements AddressService {
    UserRepository userRepository;
    AddressRepository addressRepository;
    AddressConverter addressConverter;

    @Override
    @PreAuthorize("hasAuthority('RUD_ADDRESS') or #userId == authentication.principal.getClaim('userId')")
    public List<AddressResponse> getAllByUserId(String userId) {
        return addressRepository.findAllByUser_IdAndIsActive(userId, StatusConstant.ACTIVE)
                .stream().map(addressConverter::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AddressResponse create(AddressCreateRequest request) {
        Address address = addressConverter.toEntity(request);

        if (!addressRepository.existsByKey(address.getKey())) {
            addressRepository.save(address);
        } else {
            Address a = addressRepository.findByKey(address.getKey());
            address.setId(a.getId());
        }

        return addressConverter.toResponse(address);
    }

    @Override
    @Transactional
    public AddressResponse update(String addressId, AddressUpdateRequest request) {
        Address currentAddress = validateUserPermissionForAddress(addressId);

        Address updatedAddress = addressConverter.toEntity(currentAddress, request);
        addressRepository.save(updatedAddress);

        return addressConverter.toResponse(updatedAddress);
    }

    @Override
    @Transactional
    public void delete(String addressId) {
        Address address = validateUserPermissionForAddress(addressId);
        address.setIsActive(StatusConstant.INACTIVE);
        addressRepository.save(address);
    }

    // address thuộc user hoặc có quyền truy cập address => true
    private Address validateUserPermissionForAddress(String addressId) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User currentUser = userRepository.findByUsernameAndIsActive(currentUsername, StatusConstant.ACTIVE)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTS));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new CustomException(ErrorCode.ADDRESS_NOT_EXISTS));

        if (!address.getUser().getId().equals(currentUser.getId())
                && !AuthUtils.hasPermission("RUD_ADDRESS")) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        return address;
    }
}
