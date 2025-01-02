package com.javaweb.dto.request;

import com.javaweb.validator.DobConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
    String id;

    @NotNull(message = "USERNAME_NOT_NULL")
    @Size(min = 5, max = 16, message = "INVALID_USERNAME")
    String username;

    @NotNull(message = "PASSWORD_NOT_NULL")
    @Size(min = 8, max = 32, message = "INVALID_PASSWORD")
    String password;

    @NotNull(message = "FULL_NAME_NOT_NULL")
    String fullName;

    @Pattern(regexp = "^0\\d{9}$", message = "INVALID_PHONE")
    String phone;

    @NotNull(message = "EMAIL_NOT_NULL")
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "INVALID_EMAIL")
    String email;

    @DobConstraint(min = 16, message = "INVALID_DOB")
    LocalDate dob;

    List<String> roles;
}
