package com.t3h.e_commerce.controller.admin;

import com.t3h.e_commerce.dto.adminResponse.BusinessHourRequest;
import com.t3h.e_commerce.dto.adminResponse.UpdateProductStatusRequest;
import com.t3h.e_commerce.dto.adminResponse.UserBasicInfoDTO;
import com.t3h.e_commerce.dto.adminResponse.UserDetailInfoDTO;
import com.t3h.e_commerce.dto.responses.OrderDetailResponse;
import com.t3h.e_commerce.entity.BusinessHour;
import com.t3h.e_commerce.enums.OrderStatusType;
import com.t3h.e_commerce.repository.BusinessHourRepository;
import com.t3h.e_commerce.service.admin.AdminUserService;
import com.t3h.e_commerce.service.admin.BusinessHourService;
import com.t3h.e_commerce.service.admin.ProductService;
import com.t3h.e_commerce.service.impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminResourceController {

    @Autowired
    private AdminUserService adminUserService;

    private final ProductService productService;

    private final BusinessHourService businessHourService;

    @Autowired
    private BusinessHourRepository businessHourRepository;

    @Autowired
    private OrderServiceImpl orderServiceImpl;

    /**
     * Vô hiệu hóa tài khoản
     */
    @PostMapping("/{userId}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Integer userId) {
        adminUserService.deactivateUser(userId);
        return ResponseEntity.ok("User deactivated successfully");
    }

    /**
     * Tạm khóa tài khoản
     */
    @PostMapping("/{userId}/lock")
    public ResponseEntity<String> lockUser(@PathVariable Integer userId) {
        adminUserService.lockUser(userId);
        return ResponseEntity.ok("User locked successfully");
    }

    /**
     * Kích hoạt lại tài khoản
     */
    @PostMapping("/{userId}/activate")
    public ResponseEntity<String> activateUser(@PathVariable Integer userId) {
        adminUserService.activateUser(userId);
        return ResponseEntity.ok("User activated successfully");
    }

    // API để lấy danh sách người dùng với thông tin cơ bản
    @GetMapping
    public ResponseEntity<List<UserBasicInfoDTO>> getAllUsersBasicInfo() {
        List<UserBasicInfoDTO> users = adminUserService.getAllUsersBasicInfo();
        return ResponseEntity.ok(users);
    }

    // API để lấy thông tin chi tiết của một người dùng cụ thể
    @GetMapping("/{userId}/details")
    public ResponseEntity<UserDetailInfoDTO> getUserDetailInfo(@PathVariable Integer userId) {
        UserDetailInfoDTO user = adminUserService.getUserDetailInfo(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    // API cập nhật trạng thái available và soldOut
    @PutMapping("/update-status")
    public ResponseEntity<String> updateProductStatus(@RequestBody UpdateProductStatusRequest request) {
        productService.updateProductStatus(request);
        return ResponseEntity.ok("Product status updated successfully");
    }

    // API cập nhật số lượng sản phẩm
    @PutMapping("/{id}/quantity")
    public ResponseEntity<String> updateProductQuantity(
            @PathVariable Integer id,
            @RequestParam Integer quantity) {
        productService.updateProductQuantity(id, quantity);
        return ResponseEntity.ok("Cập nhật số lượng thành công!");
    }

    /**
     *Set giờ mở của, đóng cửa */
    @PostMapping("/set-hours")
    public ResponseEntity<Map<String, String>> setBusinessHours(@RequestBody List<BusinessHourRequest> requests) {
        businessHourService.setBusinessHours(requests);
        return ResponseEntity.ok(Collections.singletonMap("message", "Business hours updated successfully!"));
    }

    @PostMapping("/toggle-closure")
    public ResponseEntity<?> toggleTemporaryClosure(@RequestParam boolean isClosed) {
        businessHourService.toggleTemporaryClosure(isClosed);
        return ResponseEntity.ok(Collections.singletonMap("message", "Temporary closure updated successfully!"));
    }

    @GetMapping("/check-opening-hours")
    public ResponseEntity<Map<String, Object>> checkOpeningHours() {
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        Optional<BusinessHour> todayHoursOpt = businessHourRepository.findByDayOfWeek(today);

        Map<String, Object> response = new HashMap<>();

        // Nếu không có dữ liệu về giờ mở cửa
        if (todayHoursOpt.isEmpty()) {
            response.put("isOpen", false);
            response.put("message", "Cửa hàng của chúng tôi hiện đang đóng cửa. Vui lòng quay lại sau.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        BusinessHour todayHours = todayHoursOpt.get();
        boolean isTemporarilyClosed = businessHourService.isTemporarilyClosed();
        LocalTime now = LocalTime.now();
        boolean isOpen = !isTemporarilyClosed &&
                now.isAfter(todayHours.getOpenTime()) &&
                now.isBefore(todayHours.getCloseTime());

        response.put("openTime", todayHours.getOpenTime().toString());
        response.put("closeTime", todayHours.getCloseTime().toString());
        response.put("isOpen", isOpen);
        response.put("isTemporarilyClosed", isTemporarilyClosed);

        return ResponseEntity.ok(response);
    }



    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Integer orderId, @RequestParam OrderStatusType status) {
        boolean updated = orderServiceImpl.updateOrderStatus(orderId, status);
        if (updated) {
            return ResponseEntity.ok("Order status updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found.");
        }
    }

    @GetMapping("/all-orders")
    public ResponseEntity<List<OrderDetailResponse>> getAllOrders() {
        List<OrderDetailResponse> orders = orderServiceImpl.getAllOrders();
        return ResponseEntity.ok(orders);
    }

}
