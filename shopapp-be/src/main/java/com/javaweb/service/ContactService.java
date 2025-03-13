package com.javaweb.service;

import com.javaweb.dto.response.PageResponse;
import com.javaweb.entity.Contact;
import org.springframework.data.domain.Pageable;

public interface ContactService {
    Contact create(Contact contact);

    PageResponse<Contact> getByIsRead(boolean isRead, Pageable pageable);

    void markAsRead(String id);

    int countUnreadContacts();
}
