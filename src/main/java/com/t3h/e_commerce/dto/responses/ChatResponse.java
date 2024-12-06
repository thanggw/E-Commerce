package com.t3h.e_commerce.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponse {
    private String content;
    private String sender;
    private LocalDateTime timestamp;
}
