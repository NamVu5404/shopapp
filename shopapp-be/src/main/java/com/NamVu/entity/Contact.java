package com.NamVu.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "contact")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Contact extends BaseEntity {
    String fullName;
    String email;
    String phone;

    @Lob // Large Object
    @Column(columnDefinition = "TEXT")
    String message;

    Boolean isRead = false;
}