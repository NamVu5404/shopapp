package com.javaweb.dto.request.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {
    @NotNull(message = "OLD_PASSWORD_NOT_NULL")
    @Size(min = 8, max = 32, message = "INVALID_PASSWORD")
    String oldPassword;

    @NotNull(message = "NEW_PASSWORD_NOT_NULL")
    @Size(min = 8, max = 32, message = "INVALID_PASSWORD")
    String newPassword;
}
