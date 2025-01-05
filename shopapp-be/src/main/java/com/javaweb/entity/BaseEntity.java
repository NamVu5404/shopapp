package com.javaweb.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BaseEntity {
    @Id
    @Column(columnDefinition = "VARCHAR(36)")
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "createddate")
    @CreatedDate
    LocalDateTime createdDate;

    @Column(name = "createdby")
    @CreatedBy
    String createdBy;

    @Column(name = "modifieddate")
    @LastModifiedDate
    LocalDateTime modifiedDate;

    @Column(name = "modifiedby")
    @LastModifiedBy
    String modifiedBy;

    @Column(name = "is_active", nullable = false)
    byte isActive = 1;
}
