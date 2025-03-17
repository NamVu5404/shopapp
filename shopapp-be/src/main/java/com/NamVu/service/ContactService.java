package com.NamVu.service;

import com.NamVu.dto.response.PageResponse;
import com.NamVu.entity.Contact;
import org.springframework.data.domain.Pageable;

public interface ContactService {
    Contact create(Contact contact);

    PageResponse<Contact> getByIsRead(boolean isRead, Pageable pageable);

    void markAsRead(String id);

    int countUnreadContacts();
}
