package com.t3h.e_commerce.enums;

public enum Bank {
    VIETCOMBANK("Vietcombank"),
    TECHCOMBANK("Techcombank"),
    BIDV("BIDV"),
    AGRIBANK("Agribank"),
    VPBANK("VPBank"),
    SACOMBANK("Sacombank");

    private final String bankName;

    Bank(String bankName) {
        this.bankName = bankName;
    }

    public String getBankName() {
        return bankName;
    }
}

