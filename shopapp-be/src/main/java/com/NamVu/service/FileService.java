package com.NamVu.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileServices {
    List<String> uploadFile(MultipartFile[] file);
}
