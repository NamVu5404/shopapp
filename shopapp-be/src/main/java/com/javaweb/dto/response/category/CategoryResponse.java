package com.javaweb.dto.response.category;

import com.javaweb.dto.response.supplier.SupplierResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    String id;
    String code;
    String name;
    List<SupplierResponse> suppliers;
}
