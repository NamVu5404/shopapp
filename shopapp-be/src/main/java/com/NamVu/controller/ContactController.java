package com.NamVu.controller;

import com.NamVu.dto.response.ApiResponse;
import com.NamVu.dto.response.PageResponse;
import com.NamVu.entity.Contact;
import com.NamVu.service.ContactService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ContactController {
    ContactService contactService;

    @PostMapping
    public ApiResponse<Contact> create(@RequestBody Contact contact) {
        return ApiResponse.<Contact>builder()
                .result(contactService.create(contact))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<Contact>> getByIsRead(
            @RequestParam boolean isRead,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate")
                .and(Sort.by(Sort.Direction.ASC, "id"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return ApiResponse.<PageResponse<Contact>>builder()
                .result(contactService.getByIsRead(isRead, pageable))
                .build();
    }

    @PatchMapping("/{id}/mark-as-read")
    public ApiResponse<Void> markAsRead(@PathVariable String id) {
        contactService.markAsRead(id);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/messages/unread/count")
    public ApiResponse<Integer> getUnreadCount() {
        return ApiResponse.<Integer>builder()
                .result(contactService.countUnreadContacts())
                .build();
    }
}
