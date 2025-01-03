package com.javaweb.dto.request.role;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleRequest {
    String id;
    @NotNull(message = "CODE_NOT_EMPTY")
    @Size(min = 1, message = "CODE_NOT_EMPTY")
    String code;
    String description;
    List<String> permissions;
}
