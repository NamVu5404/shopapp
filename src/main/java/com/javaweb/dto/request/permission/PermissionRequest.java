package com.javaweb.dto.request.permission;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionRequest {
    String id;
    @NotNull(message = "CODE_NOT_EMPTY")
    @Size(min = 1, message = "CODE_NOT_EMPTY")
    String code;
    String description;
}
