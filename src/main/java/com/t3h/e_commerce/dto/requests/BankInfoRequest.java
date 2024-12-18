package com.t3h.e_commerce.dto.requests;



public class BankInfoRequest {

    private String bankName;


    private String bankAccount;

    // Getters và Setters
    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount;
    }
}
