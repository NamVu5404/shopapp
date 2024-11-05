package com.javaweb.utils;

public class CheckUtil {
    public static boolean check(String input) {
        return input != null && !input.trim().isEmpty();
    }

    public static boolean check(Integer input) {
        return input != null;
    }

    public static boolean check(Long input) {
        return input != null;
    }
}
