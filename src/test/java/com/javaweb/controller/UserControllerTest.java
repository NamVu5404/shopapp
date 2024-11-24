package com.javaweb.controller;

import com.javaweb.dto.request.UserRequest;
import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.response.UserResponse;
import com.javaweb.exception.ErrorCode;
import com.javaweb.service.UserService;
import com.javaweb.utils.ObjectMapperUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource("/test.properties")
/*
 * mvn clean test jacoco:report
 */
public class UserControllerTest {

    @MockBean
    private UserService userService;

    @Autowired
    private MockMvc mockMvc;

    private UserRequest request;
    private UserResponse response;
    private UserSearchRequest searchRequest;
    private final String ID = "123";

    @BeforeEach
    public void initData() {
        LocalDate dob = LocalDate.of(2000, 1, 1);

        request = UserRequest.builder()
                .username("username")
                .password("12345678")
                .fullName("Full Name")
                .phone("0123456789")
                .email("email@email.com")
                .dob(dob)
                .roles(Arrays.asList("ADMIN", "CUSTOMER"))
                .build();

        response = UserResponse.builder()
                .id(ID)
                .username("username")
                .fullName("Full Name")
                .phone("0123456789")
                .email("email@email.com")
                .dob(dob)
                .roles(Arrays.asList("ADMIN", "CUSTOMER"))
                .build();

        searchRequest = UserSearchRequest.builder()
                .username("username")
                .phone("0123456789")
                .build();
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void search_validRequest_success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/users")
                        .param("username", searchRequest.getUsername())
                        .param("phone", searchRequest.getPhone()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000));
    }

    @Test
    public void create_invalidUsername_fail() throws Exception {
        request.setUsername("abc");
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.INVALID_USERNAME.getCode()));
    }

    @Test
    public void create_invalidPassword_fail() throws Exception {
        request.setPassword("123");
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.INVALID_PASSWORD.getCode()));
    }

    @Test
    public void create_invalidFullName_fail() throws Exception {
        request.setFullName(null);
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.FULL_NAME_NOT_NULL.getCode()))
                .andExpect(MockMvcResultMatchers.jsonPath("message")
                        .value(ErrorCode.FULL_NAME_NOT_NULL.getMessage()));
    }

    @Test
    public void create_invalidPhone_fail() throws Exception {
        request.setPhone("12345");
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.INVALID_PHONE.getCode()));
    }

    @Test
    public void create_invalidEmail_fail() throws Exception {
        request.setEmail("abc.com");
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.INVALID_EMAIL.getCode()))
                .andExpect(MockMvcResultMatchers.jsonPath("message")
                        .value(ErrorCode.INVALID_EMAIL.getMessage()));
    }

    @Test
    public void create_invalidDob_fail() throws Exception {
        request.setDob(LocalDate.of(2020, 1, 1));
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.INVALID_DOB.getCode()));
    }

    @Test
    public void create_validRequest_success() throws Exception {
        // GIVEN
        String content = ObjectMapperUtil.toJson(request);

        when(userService.create(any())).thenReturn(response);

        // WHEN, THEN
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000))
                .andExpect(MockMvcResultMatchers.jsonPath("result.id")
                        .value(response.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.username")
                        .value(response.getUsername()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.fullName")
                        .value(response.getFullName()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.phone")
                        .value(response.getPhone()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.email")
                        .value(response.getEmail()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.dob")
                        .value(response.getDob().toString()));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void update_invalidUsername_fail() throws Exception {
        request.setId(ID);
        request.setUsername("abc");
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/{id}", ID)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.INVALID_USERNAME.getCode()));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void update_invalidPassword_fail() throws Exception {
        request.setId(ID);
        request.setPassword("123");
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/{id}", ID)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.INVALID_PASSWORD.getCode()));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void update_invalidFullName_fail() throws Exception {
        request.setId(ID);
        request.setFullName(null);
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/{id}", ID)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.FULL_NAME_NOT_NULL.getCode()))
                .andExpect(MockMvcResultMatchers.jsonPath("message")
                        .value(ErrorCode.FULL_NAME_NOT_NULL.getMessage()));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void update_invalidPhone_fail() throws Exception {
        request.setId(ID);
        request.setPhone("12345");
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/{id}", ID)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.INVALID_PHONE.getCode()));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void update_invalidEmail_fail() throws Exception {
        request.setId(ID);
        request.setEmail("abc.com");
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/{id}", ID)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.INVALID_EMAIL.getCode()))
                .andExpect(MockMvcResultMatchers.jsonPath("message")
                        .value(ErrorCode.INVALID_EMAIL.getMessage()));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void update_invalidDob_fail() throws Exception {
        request.setId(ID);
        request.setDob(LocalDate.of(2020, 1, 1));
        String content = ObjectMapperUtil.toJson(request);

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/{id}", ID)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("code")
                        .value(ErrorCode.INVALID_DOB.getCode()));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void update_validRequest_success() throws Exception {
        // GIVEN
        request.setId(ID);
        String content = ObjectMapperUtil.toJson(request);

        when(userService.update(anyString(), any())).thenReturn(response);

        // WHEN, THEN
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/users/{id}", ID)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000))
                .andExpect(MockMvcResultMatchers.jsonPath("result.id")
                        .value(response.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.username")
                        .value(response.getUsername()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.fullName")
                        .value(response.getFullName()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.phone")
                        .value(response.getPhone()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.email")
                        .value(response.getEmail()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.dob")
                        .value(response.getDob().toString()));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void delete_validRequest_success() throws Exception {
        List<String> ids = Collections.singletonList(ID);

        doNothing().when(userService).delete(ids);

        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/users/{ids}", String.join(",", ids)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000));
    }

    @Test
    @WithMockUser
    public void getMyInfo_validRequest_success() throws Exception {
        when(userService.getMyInfo()).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/users/myInfo"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000))
                .andExpect(MockMvcResultMatchers.jsonPath("result.id")
                        .value(response.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.username")
                        .value(response.getUsername()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.fullName")
                        .value(response.getFullName()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.phone")
                        .value(response.getPhone()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.email")
                        .value(response.getEmail()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.dob")
                        .value(response.getDob().toString()));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    public void getById_validRequest_success() throws Exception {
        when(userService.getById(anyString())).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/users/{ids}", ID))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000))
                .andExpect(MockMvcResultMatchers.jsonPath("result.id")
                        .value(response.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.username")
                        .value(response.getUsername()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.fullName")
                        .value(response.getFullName()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.phone")
                        .value(response.getPhone()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.email")
                        .value(response.getEmail()))
                .andExpect(MockMvcResultMatchers.jsonPath("result.dob")
                        .value(response.getDob().toString()));
    }
}
