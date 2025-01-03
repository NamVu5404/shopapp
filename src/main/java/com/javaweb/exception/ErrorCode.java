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
    USERNAME_NOT_NULL(1004, "Username is required", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_NULL(1005, "Password is required", HttpStatus.BAD_REQUEST),
    FULL_NAME_NOT_NULL(1006, "Full name is required", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_NULL(1007, "Email is required", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME(1009, "Username must be at least {min} characters and" +
            " no more than {max} characters.", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1010, "Password must be at least {min} characters and" +
            " no more than {max} characters.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1011, "Invalid email format", HttpStatus.BAD_REQUEST),
    INVALID_PHONE(1012, "Invalid phone format", HttpStatus.BAD_REQUEST),
    INVALID_DOB(1013, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1014, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1015, "You are not authorized", HttpStatus.FORBIDDEN),
    ROLE_NOT_EXISTS(1016, "Role not exists", HttpStatus.NOT_FOUND),
    ROLE_EXISTS(1017, "Role already exists", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_EXISTS(1018, "Permission not exists", HttpStatus.NOT_FOUND),
    PERMISSION_EXISTS(1019, "Permission already exists", HttpStatus.BAD_REQUEST),
    CODE_NOT_EMPTY(1020, "Code is required", HttpStatus.BAD_REQUEST),
    INVALID_DELETE_ROLE(1021, "'ROLE' cannot be deleted " +
            "because it is assigned to users. Please unassign all users first", HttpStatus.BAD_REQUEST),
    INVALID_DELETE_PERMISSION(1022, "'PERMISSION' cannot be deleted " +
            "because it is assigned to roles. Please unassign all roles first", HttpStatus.BAD_REQUEST),
    PASSWORD_EXISTS(1023, "Password already exists", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_INCORRECT(1024, "Old password incorrect", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_NOT_NULL(1025, "Old password is required", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_NOT_NULL(1026, "New password is required", HttpStatus.BAD_REQUEST),
    ;

    int code;
    String message;
    HttpStatusCode statusCode;
}
