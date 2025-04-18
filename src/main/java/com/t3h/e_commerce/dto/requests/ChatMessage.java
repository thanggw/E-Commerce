package com.t3h.e_commerce.dto.requests;


import java.text.SimpleDateFormat;
import java.util.Date;

public class ChatMessage {
    private String sender;
    private String receiver;
    private String content;
    private String role;

    public ChatMessage() {}

    public ChatMessage(String sender, String content, String role) {
        this.sender = sender;
        this.content = content;
        this.role = role;
    }

    public String getReceiver() {
        return receiver;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}



