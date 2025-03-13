package com.javaweb.repository;

import com.javaweb.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, String> {
    Page<Contact> findAllByIsRead(Boolean isRead, Pageable pageable);

    int countByIsRead(Boolean isRead);
}
