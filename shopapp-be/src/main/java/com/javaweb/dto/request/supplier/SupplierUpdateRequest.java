package com.javaweb.dto.request.supplier;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SupplierUpdateRequest {
    @NotBlank(message = "NAME_NOT_BLANK")
    String name;
}
