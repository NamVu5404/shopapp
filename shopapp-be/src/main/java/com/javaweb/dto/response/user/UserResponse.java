package com.javaweb.dto.response.user;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    String fullName;
    String phone;
    LocalDate dob;
    LocalDateTime createdDate;
    LocalDateTime modifiedDate;
    String modifiedBy;
    byte isActive;
    byte isGuest;
    List<String> roles;

    @Builder.Default
    boolean hasPassword = true;
}
