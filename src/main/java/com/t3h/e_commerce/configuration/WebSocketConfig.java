package com.t3h.e_commerce.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // Endpoint WebSocket
                .setAllowedOriginPatterns("*")
                .withSockJS(); // Hỗ trợ SockJS cho trình duyệt không hỗ trợ WebSocket
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic"); // Tin nhắn sẽ được gửi đến "/topic/messages"
        registry.setApplicationDestinationPrefixes("/app"); // Prefix cho các endpoint xử lý tin nhắn
    }
}

