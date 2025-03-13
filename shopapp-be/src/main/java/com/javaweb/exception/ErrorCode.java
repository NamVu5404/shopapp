package com.javaweb.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid Key", HttpStatus.BAD_REQUEST),
    USER_EXISTS(1002, "User already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTS(1003, "User not exists", HttpStatus.NOT_FOUND),
    PASSWORD_NOT_BLANK(1004, "Password is required", HttpStatus.BAD_REQUEST),
    FULL_NAME_NOT_BLANK(1005, "Full name is required", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_BLANK(1006, "Email is required", HttpStatus.BAD_REQUEST),
    PHONE_NOT_BLANK(1007, "Phone is required", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1008, "Password must be at least {min} characters and" +
            " no more than {max} characters.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1009, "Invalid email format", HttpStatus.BAD_REQUEST),
    INVALID_PHONE(10010, "Invalid phone format", HttpStatus.BAD_REQUEST),
    INVALID_DOB(1011, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1012, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1013, "You are not authorized", HttpStatus.FORBIDDEN),
    ROLE_NOT_EXISTS(1014, "Role not exists", HttpStatus.NOT_FOUND),
    ROLE_EXISTS(1015, "Role already exists", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_EXISTS(1015, "Permission not exists", HttpStatus.NOT_FOUND),
    PERMISSION_EXISTS(1017, "Permission already exists", HttpStatus.BAD_REQUEST),
    CODE_NOT_BLANK(1018, "Code is required", HttpStatus.BAD_REQUEST),
    INVALID_DELETE_ROLE(1019, "'ROLE' cannot be deleted " +
            "because it is assigned to users. Please unassign all users first", HttpStatus.BAD_REQUEST),
    INVALID_DELETE_PERMISSION(1020, "'PERMISSION' cannot be deleted " +
            "because it is assigned to roles. Please unassign all roles first", HttpStatus.BAD_REQUEST),
    PASSWORD_EXISTS(1021, "Password already exists", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_INCORRECT(1022, "Old password incorrect", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_NOT_BLANK(1023, "Old password is required", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_NOT_BLANK(1024, "New password is required", HttpStatus.BAD_REQUEST),
    ADDRESS_NOT_EXISTS(1025, "Address not exists", HttpStatus.NOT_FOUND),
    PROVINCE_NOT_BLANK(1026, "Province is required", HttpStatus.BAD_REQUEST),
    DISTRICT_NOT_BLANK(1027, "District is required", HttpStatus.BAD_REQUEST),
    WARD_NOT_BLANK(1028, "Ward is required", HttpStatus.BAD_REQUEST),
    ADDRESS_DETAIL_NOT_BLANK(1029, "Address detail is required", HttpStatus.BAD_REQUEST),
    USER_ID_NOT_BLANK(1030, "User id is required", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTS(1031, "Category already exists", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTS(1032, "Category not exists", HttpStatus.NOT_FOUND),
    SUPPLIER_EXISTS(1031, "Supplier already exists", HttpStatus.BAD_REQUEST),
    SUPPLIER_NOT_EXISTS(1032, "Supplier not exists", HttpStatus.NOT_FOUND),
    CATEGORY_ID_NOT_BLANK(1033, "Category id is required", HttpStatus.BAD_REQUEST),
    SUPPLIER_ID_NOT_BLANK(1034, "Supplier id is required", HttpStatus.BAD_REQUEST),
    NAME_NOT_BLANK(1035, "Name is required", HttpStatus.BAD_REQUEST),
    PRICE_NOT_NULL(1036, "Price is not null", HttpStatus.BAD_REQUEST),
    PRODUCT_EXISTS(1037, "Product already exists", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_EXISTS(1038, "Product not exists", HttpStatus.NOT_FOUND),
    DISCOUNT_EXISTS(1039, "Discount already exists", HttpStatus.BAD_REQUEST),
    DISCOUNT_NOT_EXISTS(1040, "Discount not exists", HttpStatus.NOT_FOUND),
    PRODUCT_ID_NOT_BLANK(1041, "Product id is required", HttpStatus.BAD_REQUEST),
    QUANTITY_NOT_NULL(1042, "Quantity is not null", HttpStatus.BAD_REQUEST),
    TOTAL_AMOUNT_NOY_NULL(1043, "Total amount is not null", HttpStatus.BAD_REQUEST),
    INVENTORY_RECEIPT_NOT_EXISTS(1044, "Inventory receipt not exists", HttpStatus.NOT_FOUND),
    CAN_NOT_EDITABLE(1045, "Can not edit in current status", HttpStatus.BAD_REQUEST),
    CART_NOT_EXISTS(1046, "Cart not exists", HttpStatus.NOT_FOUND),
    INVENTORY_NOT_ENOUGH(1047, "Inventory is not enough", HttpStatus.NOT_FOUND),
    ORDER_NOT_EXISTS(1048, "Order not exists", HttpStatus.NOT_FOUND),
    MIN_QUANTITY(1049, "Quantity must be at least 1", HttpStatus.BAD_REQUEST),
    MIN_PRICE(1050, "Price must be at least 1000 vnd", HttpStatus.BAD_REQUEST),
    ALREADY_REVIEWED(1051, "You have already reviewed this order", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_IN_ORDER(1052, "Product is not part of this order", HttpStatus.BAD_REQUEST),
    CAN_NOT_REVIEW(1053, "Can not review in current status", HttpStatus.BAD_REQUEST),
    ;

    int code;
    String message;
    HttpStatusCode statusCode;
}
