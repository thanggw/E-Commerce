package com.t3h.e_commerce.controller.pages;



import com.t3h.e_commerce.dto.requests.ChatMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;

@Controller
public class ChatController {

    private static final Set<String> customerList = new HashSet<>(); // Lưu danh sách customer đã nhắn tin
    private static final Map<String, List<ChatMessage>> messageHistory = new HashMap<>(); // Lưu tin nhắn theo từng khách hàng

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessage message) {
        if ("customer".equals(message.getRole())) {
            customerList.add(message.getSender()); // Lưu customer nếu chưa có
        }

        // Lưu tin nhắn vào messageHistory
        messageHistory.computeIfAbsent(message.getSender(), k -> new ArrayList<>()).add(message);

        return message;
    }

    @MessageMapping("/customerList")
    @SendTo("/topic/customerList")
    public Set<String> getCustomerList() {
        return customerList;
    }

    @MessageMapping("/getMessages")
    @SendTo("/topic/chatHistory")
    public List<ChatMessage> getChatHistory(ChatMessage request) {
        return messageHistory.getOrDefault(request.getSender(), new ArrayList<>());
    }
}






