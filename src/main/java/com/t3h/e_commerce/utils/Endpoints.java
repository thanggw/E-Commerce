package com.t3h.e_commerce.utils;

public class Endpoints {
    public static final String[] Public_Endpoints = {
            "/api/auth/authenticate",
            "/users/registration",
            "/guests/login",
            "/products/all-products",
            "/home-guest",   // Thêm đường dẫn này
            "/"
    };

    public static final String[] Admin_Endpoints = {
            "/products/create"
    };
}
