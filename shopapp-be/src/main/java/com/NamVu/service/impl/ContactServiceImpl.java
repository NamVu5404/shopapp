package com.NamVu.service.impl;

import com.NamVu.dto.response.PageResponse;
import com.NamVu.entity.Contact;
import com.NamVu.repository.ContactRepository;
import com.NamVu.service.ContactService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ContactServiceImpl implements ContactService {
    ContactRepository contactRepository;

    @Override
    public Contact create(Contact contact) {
        return contactRepository.save(contact);
    }

    @Override
    @PreAuthorize("hasAuthority('RU_CONTACT')")
    public PageResponse<Contact> getByIsRead(boolean isRead, Pageable pageable) {
        Page<Contact> contacts = contactRepository.findAllByIsRead(isRead, pageable);

        return PageResponse.<Contact>builder()
                .pageSize(pageable.getPageSize())
                .currentPage(pageable.getPageNumber() + 1)
                .totalElements(contacts.getTotalElements())
                .totalPage(contacts.getTotalPages())
                .data(contacts.getContent())
                .build();
    }

    @Override
    @PreAuthorize("hasAuthority('RU_CONTACT')")
    public void markAsRead(String id) {
        contactRepository.findById(id).ifPresent(contact -> {
            contact.setIsRead(true);
            contactRepository.save(contact);
        });
    }

    @Override
    @PreAuthorize("hasAuthority('RU_CONTACT')")
    public int countUnreadContacts() {
        return contactRepository.countByIsRead(false);
    }
}
