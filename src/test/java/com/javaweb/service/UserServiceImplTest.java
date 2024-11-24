package com.javaweb.service;

import com.javaweb.converter.UserConverter;
import com.javaweb.dto.request.UserRequest;
import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.response.UserResponse;
import com.javaweb.entity.User;
import com.javaweb.exception.CustomException;
import com.javaweb.exception.ErrorCode;
import com.javaweb.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource("/test.properties")
public class UserServiceImplTest {

    @MockBean
    private UserConverter userConverter;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private Authentication authentication;

    @MockBean
    private SecurityContext securityContext;

    @Autowired
    private UserService userService;

    private UserRequest request;
    private UserResponse response;
    private UserSearchRequest searchRequest;
    private User user;
    private final String ID = "123";

    @BeforeEach
    public void initData() {
        LocalDate dob = LocalDate.of(2000, 1, 1);

        user = User.builder()
                .id(ID)
                .username("username")
                .fullName("Full Name")
                .phone("0123456789")
                .email("email@email.com")
                .dob(dob)
                .status((byte) 1)
                .build();

        request = UserRequest.builder()
                .username("username")
                .password("12345678")
                .fullName("Full Name")
                .phone("0123456789")
                .email("email@email.com")
                .dob(dob)
                .build();

        response = UserResponse.builder()
                .id(ID)
                .username("username")
                .fullName("Full Name")
                .phone("0123456789")
                .email("email@email.com")
                .dob(dob)
                .build();

        searchRequest = UserSearchRequest.builder()
                .username("username")
                .phone("0123456789")
                .build();
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void search_validRequest_success() {
        // GIVEN
        when(userRepository.findAll(searchRequest)).thenReturn(Collections.singletonList(user));
        when(userConverter.toResponse(any())).thenReturn(response);

        // WHEN
        List<UserResponse> result = userService.search(searchRequest);

        // THEN
        result.forEach(userResponse -> {
            assertThat(userResponse.getUsername()).isEqualTo(user.getUsername());
            assertThat(userResponse.getPhone()).isEqualTo(user.getPhone());
        });
    }

    @Test
    public void create_userExists_fail() {
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        CustomException exception = assertThrows(CustomException.class, () -> userService.create(request));

        assertThat(exception.getErrorCode().getCode())
                .isEqualTo(ErrorCode.USER_EXISTS.getCode());
    }

    @Test
    public void create_validRequest_success() {
        // GIVEN
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userConverter.toEntity(any())).thenReturn(user);
        when(userRepository.save(any())).thenReturn(user);
        when(userConverter.toResponse(any())).thenReturn(response);

        // WHEN
        UserResponse result = userService.create(request);

        // THEN
        assertThat(result.getId()).isEqualTo(ID);
        assertThat(result.getUsername()).isEqualTo(user.getUsername());
        assertThat(result.getPhone()).isEqualTo(user.getPhone());
        assertThat(result.getEmail()).isEqualTo(user.getEmail());
        assertThat(result.getDob()).isEqualTo(user.getDob());
    }

    @Test
    public void update_usernameChanged_fail() {
        when(authentication.getName()).thenReturn("username123");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        CustomException exception = assertThrows(CustomException.class,
                () -> userService.update(ID, request));

        assertThat(exception.getErrorCode().getCode())
                .isEqualTo(ErrorCode.UNAUTHORIZED.getCode());
    }

    @Test
    public void update_userNotExists_fail() {
        when(authentication.getName()).thenReturn("username");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.existsByIdAndStatus(anyString(), anyByte())).thenReturn(false);

        CustomException exception = assertThrows(CustomException.class, () -> userService.update(ID, request));

        assertThat(exception.getErrorCode().getCode())
                .isEqualTo(ErrorCode.USER_NOT_EXISTS.getCode());
    }

    @Test
    public void update_validRequest_success() {
        // GIVEN
        when(authentication.getName()).thenReturn("username");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.existsByIdAndStatus(anyString(), anyByte())).thenReturn(true);
        when(userConverter.toEntity(any())).thenReturn(user);
        when(userRepository.save(any())).thenReturn(user);
        when(userConverter.toResponse(any())).thenReturn(response);

        // WHEN
        UserResponse result = userService.update(ID, request);

        // THEN
        assertThat(result.getId()).isEqualTo(ID);
        assertThat(result.getUsername()).isEqualTo(user.getUsername());
        assertThat(result.getPhone()).isEqualTo(user.getPhone());
        assertThat(result.getEmail()).isEqualTo(user.getEmail());
        assertThat(result.getDob()).isEqualTo(user.getDob());
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void delete_userNotExists_fail() {
        when(userRepository.findById(anyString())).thenReturn(Optional.empty());

        CustomException exception = assertThrows(CustomException.class,
                () -> userService.delete(Collections.singletonList(ID)));

        assertThat(exception.getErrorCode().getCode())
                .isEqualTo(ErrorCode.USER_NOT_EXISTS.getCode());
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void delete_validRequest_success() {
        when(userRepository.findById(anyString())).thenReturn(Optional.of(user));
        when(userRepository.saveAll(any())).thenReturn(Collections.singletonList(user));

        userService.delete(Collections.singletonList(ID));

        assertThat(user.getStatus()).isEqualTo((byte) 0);
    }

    @Test
    public void getMyInfo_userNotExists_fail() {
        when(authentication.getName()).thenReturn("username");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsernameAndStatus(anyString(), anyByte())).thenReturn(Optional.empty());

        CustomException exception = assertThrows(CustomException.class,
                () -> userService.getMyInfo());

        assertThat(exception.getErrorCode().getCode())
                .isEqualTo(ErrorCode.USER_NOT_EXISTS.getCode());
    }

    @Test
    public void getMyInfo_validRequest_success() {
        when(authentication.getName()).thenReturn("username");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsernameAndStatus(anyString(), anyByte())).thenReturn(Optional.of(user));
        when(userConverter.toResponse(any())).thenReturn(response);

        UserResponse result = userService.getMyInfo();

        assertThat(result.getId()).isEqualTo(ID);
        assertThat(result.getUsername()).isEqualTo(user.getUsername());
        assertThat(result.getPhone()).isEqualTo(user.getPhone());
        assertThat(result.getEmail()).isEqualTo(user.getEmail());
        assertThat(result.getDob()).isEqualTo(user.getDob());
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void getById_userNotExists_fail() {
        when(userRepository.findByIdAndStatus(anyString(), anyByte())).thenReturn(Optional.empty());

        CustomException exception = assertThrows(CustomException.class,
                () -> userService.getById(ID));

        assertThat(exception.getErrorCode().getCode())
                .isEqualTo(ErrorCode.USER_NOT_EXISTS.getCode());
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void getById_validRequest_success() {
        when(userRepository.findByIdAndStatus(anyString(), anyByte())).thenReturn(Optional.of(user));
        when(userConverter.toResponse(any())).thenReturn(response);

        UserResponse result = userService.getById(ID);

        assertThat(result.getId()).isEqualTo(ID);
        assertThat(result.getUsername()).isEqualTo(user.getUsername());
        assertThat(result.getPhone()).isEqualTo(user.getPhone());
        assertThat(result.getEmail()).isEqualTo(user.getEmail());
        assertThat(result.getDob()).isEqualTo(user.getDob());
    }
}
