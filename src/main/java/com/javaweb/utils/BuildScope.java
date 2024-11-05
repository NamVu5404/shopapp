package com.javaweb.utils;

import com.javaweb.entity.Role;

import java.util.List;
import java.util.StringJoiner;

public class BuildScope {
    public static String buildScope(List<Role> roles) {
        StringJoiner scope = new StringJoiner(" ");

        roles.forEach(role -> {
            scope.add("ROLE_" + role.getCode());

            role.getPermissions().forEach(permission ->
                    scope.add(permission.getCode())
            );
        });

        return scope.toString();
    }
}
