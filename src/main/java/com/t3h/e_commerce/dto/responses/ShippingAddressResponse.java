package com.t3h.e_commerce.dto.responses;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShippingAddressResponse {
    private String name;
    private String address;
    private String city;
    private String phoneNumber;
}
